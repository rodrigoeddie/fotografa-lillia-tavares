export interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
}

export interface FlatNode extends TreeNode {
  depth: number;
}

const fileTree = ref<TreeNode[]>([]);
const expandedPaths = ref(new Set<string>());

export function useAdminFileManager(showMessage: (msg: string, type: 'success' | 'error') => void) {
  const renamingPath = ref<string | null>(null);
  const renameValue = ref('');
  const creatingIn = ref<string | null>(null);
  const createName = ref('');
  const createType = ref<'file' | 'dir'>('file');

  const ctxMenu = ref<{ visible: boolean; x: number; y: number; node: FlatNode | null }>({
    visible: false, x: 0, y: 0, node: null,
  });

  const fileEditorOpen = ref(false);
  const fileEditorPath = ref('');
  const fileEditorContent = ref('');
  const fileEditorSaving = ref(false);
  const fileEditorLoading = ref(false);
  const fileEditorDirty = ref(false);

  const selectedWork = ref('');

  const portfolioWorks = computed(() => {
    const results: { label: string; value: string }[] = [];
    const root = fileTree.value.find(n => n.name === 'ensaio-fotografico');
    if (!root?.children) return results;
    for (const catNode of root.children) {
      if (!catNode.isDirectory || !catNode.children) continue;
      const catSlug = catNode.name.replace(/^\d+\./, '');
      for (const workNode of catNode.children) {
        if (workNode.isDirectory || !workNode.name.endsWith('.json') || workNode.name === 'index.json') continue;
        const workSlug = workNode.name.replace(/\.json$/, '').replace(/^\d+\./, '');
        results.push({ label: `${catSlug} / ${workSlug}`, value: `${catSlug}/${workSlug}` });
      }
    }
    return results;
  });

  const flatTree = computed<FlatNode[]>(() => {
    const result: FlatNode[] = [];
    function walk(nodes: TreeNode[], depth: number) {
      for (const node of nodes) {
        result.push({ ...node, depth });
        if (node.isDirectory && expandedPaths.value.has(node.path)) {
          walk(node.children || [], depth + 1);
        }
      }
    }
    walk(fileTree.value, 0);
    return result;
  });

  async function loadFileTree() {
    try {
      fileTree.value = await $fetch<TreeNode[]>('/api/fs/tree', { params: { _t: Date.now() } });
    } catch (e: any) {
      showMessage('Erro ao carregar árvore de arquivos: ' + e.message, 'error');
    }
  }

  function toggleDir(path: string) {
    const s = new Set(expandedPaths.value);
    s.has(path) ? s.delete(path) : s.add(path);
    expandedPaths.value = s;
  }

  async function openFileEditor(filePath: string) {
    fileEditorPath.value = filePath;
    fileEditorOpen.value = true;
    fileEditorLoading.value = true;
    fileEditorDirty.value = false;
    try {
      const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(filePath)}`);
      let content = res.content;
      if (filePath.endsWith('.json')) {
        try { content = JSON.stringify(JSON.parse(content), null, 2); } catch { /* keep as-is */ }
      }
      fileEditorContent.value = content;
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + e.message, 'error');
      fileEditorOpen.value = false;
    } finally {
      fileEditorLoading.value = false;
    }
  }

  async function saveFileEditor() {
    fileEditorSaving.value = true;
    try {
      await $fetch('/api/fs/raw', {
        method: 'POST',
        body: { path: fileEditorPath.value, content: fileEditorContent.value },
      });
      fileEditorDirty.value = false;
      showMessage('Arquivo salvo!', 'success');
    } catch (e: any) {
      showMessage('Erro ao salvar: ' + e.message, 'error');
    } finally {
      fileEditorSaving.value = false;
    }
  }

  function startRename(node: FlatNode) {
    renamingPath.value = node.path;
    renameValue.value = node.name;
  }

  async function confirmRename() {
    if (!renamingPath.value || !renameValue.value.trim()) { renamingPath.value = null; return; }
    try {
      await $fetch('/api/fs/action', { method: 'POST', body: { action: 'rename', path: renamingPath.value, newName: renameValue.value.trim() } });
      await loadFileTree();
      showMessage('Renomeado!', 'success');
    } catch (e: any) {
      showMessage('Erro ao renomear: ' + e.message, 'error');
    } finally {
      renamingPath.value = null;
    }
  }

  async function deleteItem(node: FlatNode) {
    if (!confirm(`Deletar "${node.name}"? ${node.isDirectory ? 'Isso irá deletar tudo dentro da pasta.' : ''}`)) return;
    try {
      await $fetch('/api/fs/action', { method: 'POST', body: { action: 'delete', path: node.path } });
      await loadFileTree();
      if (fileEditorPath.value.startsWith(node.path)) fileEditorOpen.value = false;
      showMessage('Deletado!', 'success');
    } catch (e: any) {
      showMessage('Erro ao deletar: ' + e.message, 'error');
    }
  }

  function startCreate(parentPath: string) {
    creatingIn.value = parentPath;
    createName.value = '';
    createType.value = 'file';
  }

  const PORTFOLIO_TEMPLATE = (catSlug: string, catTitle: string) => JSON.stringify({
    artigo: 'a',
    home: false,
    homeOrder: 99,
    colorHighlight: '#0e2b42',
    title: '',
    description: '<p></p>',
    category: { slug: catSlug, title: catTitle },
    local: "<a href='https://www.fotografalilliatavares.com.br/estudio'>Estúdio Lillia Tavares</a>",
    album: [],
  }, null, 2);

  async function confirmCreate() {
    if (!createName.value.trim()) { creatingIn.value = null; return; }
    const parentPath = creatingIn.value || '';
    const name = createName.value.trim();

    const parts = parentPath.split('/');
    const isPortfolioCategory =
      parts[0] === 'ensaio-fotografico' &&
      parts.length === 2 &&
      createType.value === 'file' &&
      name.endsWith('.json');

    try {
      await $fetch('/api/fs/action', { method: 'POST', body: { action: 'create', path: parentPath, name, type: createType.value } });

      if (isPortfolioCategory) {
        const catSlug = parts[1]!.replace(/^\d+\./, '');
        const catTitle = catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' ');
        const newFilePath = parentPath ? `${parentPath}/${name}` : name;
        await $fetch('/api/fs/raw', { method: 'POST', body: { path: newFilePath, content: PORTFOLIO_TEMPLATE(catSlug, catTitle) } });
        showMessage('Arquivo criado com template de portfolio!', 'success');
      } else {
        showMessage('Criado!', 'success');
      }

      if (parentPath) { const s = new Set(expandedPaths.value); s.add(parentPath); expandedPaths.value = s; }
      await loadFileTree();
    } catch (e: any) {
      showMessage('Erro ao criar: ' + e.message, 'error');
    } finally {
      creatingIn.value = null;
    }
  }

  function openCtxMenu(e: MouseEvent, node: FlatNode) {
    e.preventDefault();
    e.stopPropagation();
    const margin = 8;
    const menuW = 220;
    const menuH = 180;
    let x = e.clientX;
    let y = e.clientY;
    if (x + menuW > window.innerWidth - margin) x = window.innerWidth - menuW - margin;
    if (y + menuH > window.innerHeight - margin) y = window.innerHeight - menuH - margin;
    ctxMenu.value = { visible: true, x, y, node };
  }

  function openCtxMenuRoot(e: MouseEvent) {
    e.preventDefault();
    openCtxMenu(e, { name: 'content', path: '', isDirectory: true, depth: -1 });
  }

  function closeCtxMenu() {
    ctxMenu.value.visible = false;
  }

  function ctxCreate(parentPath: string, type: 'file' | 'dir') {
    closeCtxMenu();
    creatingIn.value = parentPath;
    createName.value = '';
    createType.value = type;
    if (parentPath) {
      const s = new Set(expandedPaths.value);
      s.add(parentPath);
      expandedPaths.value = s;
    }
  }

  function fileIcon(node: FlatNode) {
    if (node.isDirectory) return expandedPaths.value.has(node.path) ? '📂' : '📁';
    if (node.name.endsWith('.json')) return '{}';
    if (node.name.endsWith('.md')) return '📝';
    return '📄';
  }

  const DEP_PATH = 'depoimentos/index.json';
  const MENU_PATH = 'globals/menu.json';
  const FAQ_PATH = 'pages/perguntas-frequentes.json';

  async function openInCms(filePath: string) {
    const parts = filePath.split('/');
    const router = useRouter();

    if (filePath === DEP_PATH) {
      selectedWork.value = '';
      await navigateTo('/admin/depoimentos');
      return;
    }

    if (filePath === MENU_PATH) {
      selectedWork.value = '';
      await navigateTo('/admin/menu');
      return;
    }

    if (filePath === FAQ_PATH) {
      selectedWork.value = '';
      await navigateTo('/admin/faq');
      return;
    }

    const isInvestimento =
      parts.length === 3 &&
      parts[0] === 'investimento' &&
      filePath.endsWith('.json');

    if (isInvestimento) {
      selectedWork.value = filePath;
      await navigateTo(`/admin/investimento?file=${encodeURIComponent(filePath)}`);
      return;
    }

    const isBlogPost =
      parts[0] === 'blog' &&
      filePath.endsWith('.json') &&
      !filePath.endsWith('index.json');

    if (isBlogPost) {
      selectedWork.value = filePath;
      await navigateTo(`/admin/blog?file=${encodeURIComponent(filePath)}`);
      return;
    }

    const isPortfolioWork =
      parts.length === 3 &&
      parts[0] === 'ensaio-fotografico' &&
      filePath.endsWith('.json');

    if (isPortfolioWork) {
      selectedWork.value = filePath;
      await navigateTo(`/admin/portfolio?file=${encodeURIComponent(filePath)}`);
      return;
    }

    openFileEditor(filePath);
  }

  return {
    fileTree,
    expandedPaths,
    flatTree,
    portfolioWorks,
    selectedWork,
    renamingPath,
    renameValue,
    creatingIn,
    createName,
    createType,
    ctxMenu,
    fileEditorOpen,
    fileEditorPath,
    fileEditorContent,
    fileEditorSaving,
    fileEditorLoading,
    fileEditorDirty,
    loadFileTree,
    toggleDir,
    openFileEditor,
    saveFileEditor,
    startRename,
    confirmRename,
    deleteItem,
    startCreate,
    confirmCreate,
    openCtxMenu,
    openCtxMenuRoot,
    closeCtxMenu,
    ctxCreate,
    fileIcon,
    openInCms,
  };
}
