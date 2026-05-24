export function useTiltEffect() {
  const hovered = ref(false);
  const tilt = ref({ rx: 0, ry: 0 });

  function onMouseMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.value = { rx: -py * 10, ry: px * 14 };
  }

  function onMouseLeave() {
    hovered.value = false;
    tilt.value = { rx: 0, ry: 0 };
  }

  const tiltStyle = computed(() => ({
    transform: `perspective(1000px) rotateX(${tilt.value.rx}deg) rotateY(${tilt.value.ry}deg)`,
    transformOrigin: `center`,
  }));

  return { hovered, tilt, tiltStyle, onMouseMove, onMouseLeave };
}
