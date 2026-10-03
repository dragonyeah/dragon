# 圆锥摆 3D 动画

基于 Remotion、React Three Fiber 和 Three.js 制作的 18 秒圆锥摆教学动画。角速度从 2.12 rad/s 平滑增加到 3.05 rad/s，并同步展示摆角、轨道半径、绳张力、向心力与受力图。

## 开始预览

```bash
npm install
npm run dev
```

Remotion Studio 启动后，在浏览器打开终端显示的本地网址。

## 导出视频

```bash
npx remotion render ConicalPendulum3D out/conical-pendulum-3d.mp4
```

## 物理参数

- 绳长：`L = 2.8 m`
- 摆球质量：`m = 0.35 kg`
- 重力加速度：`g = 9.81 m/s²`
- 动画参数、物理计算及画面定义：`src/Composition.tsx`

圆锥摆关系式：`T cos θ = mg`、`T sin θ = mω²r`、`r = L sin θ`。
