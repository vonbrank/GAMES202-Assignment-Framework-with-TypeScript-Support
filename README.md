<div align="center">
  <img src="https://picx.zhimg.com/v2-41eb81c245376255947091608fcd4c91_1440w.jpg?source=172ae18b" alt="Logo" style="max-width: 100%; object-fit: cover; width: 360px;">

  <h3 align="center">GAMES202 Assignment Framework with TypeScript Support</h3>

  <p align="center">
    【GAMES202】 × 【Vite + TypeScript】
  </p>
</div>

## 关于本项目

[《GAMES202：高质量实时渲染》](https://games-cn.org/games202/)是由闫令琪老师开设的计算机图形学进阶课程。

GAMES202 课程作业大都基于 [WebGL](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API) 实现。得益于 WebGL 简单易用的特点，这免去了我们手动配置 OpenGL 的麻烦。

然而原代码框架使用传统 Web 前端技术与原生 JavaScript 进行编写，缺乏代码提示与静态检查，使得完成作业、调试 bug 较为困难。

因此本项目针对 [GAMES202 官方作业代码框架](https://games-cn.org/forums/topic/games202zuoyehuizong/)进行简单修改，将原代码框架迁移至 [TypeScript](https://www.tslang.cn/)，使用 [Vite](https://vitejs.dev/) 进行打包，并引入 [ES Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 模块化，同时实现类型声明与静态检查，期望能提升开发体验。

<div align="center">
  <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Sr-QUSUn--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1jf8itjh1lracaaola8c.png" alt="JS to TS" style="max-width: 100%; object-fit: cover; width: 640px;">
</div>

## 获取代码框架

下表列出了迁移进度，你可以直接点击链接转跳到对应分支浏览并下载代码框架，也可以直接使用 `git clone -b <branch> <url>` 指令下载对应分支代码。

|      |                  题目                   |                             现状                             |
| :--: | :-------------------------------------: | :----------------------------------------------------------: |
|  00  | WebGL 框架的使用与 Blinn-Phong 着色模型 | [可用](https://github.com/vonbrank/GAMES202-Assignment-Framework-with-TypeScript-Support/tree/assignment-00) |
|  01  |                实时阴影                 | [可用](https://github.com/vonbrank/GAMES202-Assignment-Framework-with-TypeScript-Support/tree/assignment-01) |
|  02  |      Precomputed Radiance Transfer      | [可用](https://github.com/vonbrank/GAMES202-Assignment-Framework-with-TypeScript-Support/tree/assignment-02) |
|  03  |        Screen Space Ray Tracing         |                            计划中                            |
|  04  |            Kulla-Conty BRDF             |                            计划中                            |
|  05  |            实时光线追踪降噪             |             暂无计划<br>（毕竟这次作业要用C++）              |

## 使用方法

+ 安装 Node.js

+ 在项目文件夹安装依赖项（只需要装一次）：

  ```bash
  npm install
  # 或者（如果你装了 yarn）
  yarn install
  ```

+ 运行项目：

  ```bash
  npm run dev
  # 或者
  yarn dev
  ```

+ 根据终端提示访问对应 URL 查看效果。
