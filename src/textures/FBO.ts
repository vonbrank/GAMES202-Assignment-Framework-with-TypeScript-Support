import { resolution } from "../engine";
export class FBO {
    framebuffer;
    texture;
    depthBuffer;

    constructor(gl: WebGLRenderingContext) {
        //创建帧缓冲区对象
        const framebuffer = gl.createFramebuffer();

        //创建纹理对象并设置其尺寸和参数
        const texture = gl.createTexture();

        //创建渲染缓冲区对象并设置其尺寸和参数
        const depthBuffer = gl.createRenderbuffer();

        //定义错误函数
        function error() {
            if (framebuffer) gl.deleteFramebuffer(framebuffer);
            if (texture) gl.deleteFramebuffer(texture);
            if (depthBuffer) gl.deleteFramebuffer(depthBuffer);
        }

        if (!framebuffer) {
            console.log("无法创建帧缓冲区对象");
            error();
            throw "failed to create frame buffer";
        }

        if (!texture) {
            console.log("无法创建纹理对象");
            error();
            throw "failed to create texture";
        }
        if (!depthBuffer) {
            console.log("无法创建渲染缓冲区对象");
            error();
            throw "failed to create depth buffer";
        }

        this.framebuffer = framebuffer;
        this.texture = texture;
        this.depthBuffer = depthBuffer;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            resolution,
            resolution,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null
        );
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        //将纹理对象存入framebuffer
        // framebuffer.texture = texture; ?

        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(
            gl.RENDERBUFFER,
            gl.DEPTH_COMPONENT16,
            resolution,
            resolution
        );

        //将纹理和渲染缓冲区对象关联到帧缓冲区对象上
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            texture,
            0
        );
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            depthBuffer
        );

        //检查帧缓冲区对象是否被正确设置
        var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (gl.FRAMEBUFFER_COMPLETE !== e) {
            console.log("渲染缓冲区设置错误" + e.toString());
            error();
            throw "failed to create fbo";
        }

        //取消当前的focus对象
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        // return framebuffer;
    }
}
