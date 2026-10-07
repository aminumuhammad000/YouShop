export const showToast = (message, type = 'error') => {
  window.dispatchEvent(new CustomEvent('youshop:toast', {
    detail: { message, type },
  }));
};
