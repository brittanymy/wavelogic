# 🌊 WaveLogic

WaveLogic is a visual and audio tool for exploring sine and cosine functions interactively.  
Render beautiful waveforms, hear them as tones, and understand the math behind them — in real-time.

---

## 🔧 Features

- **Audio Synthesis**: Each expression plays a matching tone using Web Audio API  
- **Live Wave Visualization**: Animate sine/cosine functions on a canvas grid  
- **Math-Aware Input**: Supports expressions like `2cos(3x)`, `0.5sin(x)`  
- **MathJax Rendering**: Clean visual formatting of expressions  
- **Mini Keyboard**: Insert math characters easily on any device  
- **Session Persistence**: Save and restore your expressions automatically  
- **Mute/Unmute**: Full control over sound output  

---

## 📚 Library

| Library            | Purpose                                                 |
|-------------------|---------------------------------------------------------|
| [MathJax](https://www.mathjax.org/)         | Renders math expressions cleanly             |
| [math.js](https://mathjs.org/)             | Evaluates mathematical expressions           |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Real-time tone generation                    |
| [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Renders waveforms visually                   |
| [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) | Persists session expressions                |

---

## 🚀 Getting Started

1. **Clone the Repo**
```
git clone https://github.com/yourusername/wavelogic.git
cd wavelogic
```

2.	**Open index.html in your browser**
🛠️ How to Use
	1.	Type expressions like sin(x) or 2cos(3x) into the input field
	2.	Press Enter or tap ⏎ on the mini keyboard to render
	3.	Toggle the mute button to enable sound
	4.	Use the Download button to export your wave screen
	5.	Reopen the app to automatically resume your session

## Deployed Link
https://wavelogic.netlify.app/