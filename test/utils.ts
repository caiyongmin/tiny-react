/**
 * 创建一个可渲染的节点
 */
export function createRoot(): HTMLDivElement {
	const root = document.createElement('div');
	root.id = 'root';
	(document.body || document.documentElement).appendChild(root);
	return root;
}

/**
 * 删除这个 root 节点
 */
export function deleteRoot(root: HTMLDivElement) {
	if (
    root
    && root.parentNode
    && typeof root.parentNode.removeChild === 'function'
  ) {
		root.parentNode.removeChild(root);
	}
}
