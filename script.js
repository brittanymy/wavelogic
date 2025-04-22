// === Init WaveLogic ===
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.getElementById('equationPanel');
    const keyboard = document.getElementById('mathKeyboard');
    const toggleKeyboard = document.getElementById('toggleKeyboard');
    const canvas = document.getElementById('waveCanvas');
    const ctx = canvas.getContext('2d');
    let focusedInput = null;
    let phase = 0;
  
    const validTrigRegex = /^[-+]?([\d.\/\(\)]+)?(sin|cos)\(.*\)$/i;
  
    function renderMathInElement(el) {
      MathJax.typesetPromise([el]);
    }
  
    function createInitialInput() {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper first-input';
  
      const input = document.createElement('div');
      input.className = 'equation-input';
      input.contentEditable = true;
      input.addEventListener('focus', () => focusedInput = input);
  
      wrapper.appendChild(input);
      panel.appendChild(wrapper);
      input.focus();
      focusedInput = input;
    }
  
    function insertRenderedExpression(expression) {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-wrapper';
  
      const input = document.createElement('div');
      input.className = 'equation-input';
      input.contentEditable = true;
      input.innerText = expression;
      input.addEventListener('focus', () => focusedInput = input);
  
      const close = document.createElement('span');
      close.className = 'close-btn';
      close.textContent = '×';
      close.onclick = () => {
        wrapper.remove();
        renderWaves();
      };
  
      wrapper.appendChild(input);
      wrapper.appendChild(close);
      panel.appendChild(wrapper);
  
      renderMathInElement(input);
      renderWaves();
    }
  
    function clearFirstInput() {
      const firstInput = document.querySelector('.first-input .equation-input');
      if (!firstInput) return;
      firstInput.innerHTML = '';
      const span = document.createElement('span');
      span.textContent = '';
      firstInput.appendChild(span);
      const range = document.createRange();
      range.setStart(span, 0);
      range.collapse(true);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      firstInput.focus();
      focusedInput = firstInput;
    }
  
    panel.addEventListener('keydown', (e) => {
      const active = document.activeElement;
      if (!active.classList.contains('equation-input')) return;
  
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const raw = active.innerText.trim();
  
        if (validTrigRegex.test(raw)) {
          insertRenderedExpression(raw);
          clearFirstInput();
        } else {
          alert("Invalid expression.");
        }
      }
  
      if (e.key === 'Backspace' && active.innerText.trim() === '') {
        const wrapper = active.closest('.input-wrapper');
        if (wrapper.classList.contains('first-input')) return;
        const prev = wrapper.previousElementSibling;
        if (prev) {
          wrapper.remove();
          prev.querySelector('.equation-input').focus();
          renderWaves();
          e.preventDefault();
        }
      }
  
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = active.closest('.input-wrapper')?.previousElementSibling;
        const prevInput = prev?.querySelector('.equation-input');
        if (prevInput) prevInput.focus();
      }
  
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = active.closest('.input-wrapper')?.nextElementSibling;
        const nextInput = next?.querySelector('.equation-input');
        if (nextInput) nextInput.focus();
      }
    });
  
    toggleKeyboard.addEventListener('click', () => {
      keyboard.style.display = keyboard.style.display === 'none' ? 'flex' : 'none';
    });
  
    function insertTextAtCursor(text) {
      const active = document.activeElement;
  
      if (!focusedInput || !focusedInput.classList.contains('equation-input') || active !== focusedInput) {
        const fallback = document.querySelector('.equation-input');
        if (fallback) {
          fallback.focus();
          focusedInput = fallback;
        } else {
          console.warn('No valid equation input to focus');
          return;
        }
      }
  
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
  
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(text);
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
      focusedInput.focus();
    }
  
    function setupKeyboard() {
      const keys = document.querySelectorAll('.math-keyboard button');
      keys.forEach(btn => {
        const clone = btn.cloneNode(true);
        btn.replaceWith(clone);
      });
  
      document.querySelectorAll('.math-keyboard button').forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.dataset.insert;
  
          if (!focusedInput || !focusedInput.classList.contains('equation-input')) {
            console.warn('No valid input is focused');
            return;
          }
  
          if (val === '←') {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;
            const range = sel.getRangeAt(0);
            range.setStart(range.startContainer, Math.max(range.startOffset - 1, 0));
            range.deleteContents();
          } else if (val === '⏎') {
            const raw = focusedInput.innerText.trim();
            if (validTrigRegex.test(raw)) {
              insertRenderedExpression(raw);
              clearFirstInput();
            } else {
              alert("Invalid expression.");
            }
          } else {
            insertTextAtCursor(val);
          }
        });
      });
    }
  
    function safeEval(expr, x) {
      try {
        return math.evaluate(expr, { x });
      } catch {
        return 0;
      }
    }
  
    function drawGrid(ctx, width, height) {
      const step = 50;
      ctx.strokeStyle = '#eee';
      ctx.lineWidth = 1;
  
      for (let x = 0; x <= width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
  
      for (let y = 0; y <= height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
  
      ctx.strokeStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
    }
  
    function renderWaves() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, canvas.width, canvas.height);
  
      const expressions = Array.from(document.querySelectorAll('.input-wrapper .equation-input'))
        .filter(input => input.textContent.trim() && !input.closest('.first-input'))
        .map(input => input.textContent.trim());
  
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const step = 0.5;
  
      expressions.forEach((expr, i) => {
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${(i * 70) % 360}, 80%, 50%)`;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
  
        for (let px = 0; px < width; px += step) {
          const x = (px / width) * 4 * Math.PI + phase;
          const y = safeEval(expr, x);
          const py = centerY - y * 50;
  
          px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
  
        ctx.stroke();
      });
    }
  
    function animate() {
      phase += 0.05;
      renderWaves();
      requestAnimationFrame(animate);
    }
  
    setupKeyboard();
    createInitialInput();
    animate();
  });
  