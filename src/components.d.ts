/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface MyToggle {
    'active': boolean;
  }
}

declare global {


  interface HTMLMyToggleElement extends Components.MyToggle, HTMLStencilElement {}
  var HTMLMyToggleElement: {
    prototype: HTMLMyToggleElement;
    new (): HTMLMyToggleElement;
  };
  interface HTMLElementTagNameMap {
    'my-toggle': HTMLMyToggleElement;
  }
}

declare namespace LocalJSX {
  interface MyToggle {
    'active'?: boolean;
  }

  interface IntrinsicElements {
    'my-toggle': MyToggle;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'my-toggle': LocalJSX.MyToggle & JSXBase.HTMLAttributes<HTMLMyToggleElement>;
    }
  }
}


