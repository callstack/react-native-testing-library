(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["1871"],{9668:function(e,n,r){"use strict";r.r(n);var s=r("5893"),i=r("65");function d(e){let n=Object.assign({h1:"h1",a:"a",p:"p",code:"code",h2:"h2",ul:"ul",li:"li",pre:"pre",div:"div"},(0,i.ah)(),e.components);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(n.h1,{id:"migration-to-2x",children:["Migration to 2.x",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#migration-to-2x",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["This guide describes steps necessary to migrate from React Native Testing Library ",(0,s.jsx)(n.code,{children:"v1.x"})," to ",(0,s.jsx)(n.code,{children:"v2.x"}),"."]}),"\n",(0,s.jsxs)(n.h2,{id:"dropping-node-8",children:["Dropping Node 8",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#dropping-node-8",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Node 8 reached its EOL more than 5 months ago, so it's about time to target the library to Node 10. If you used lower version, you'll have to upgrade to v10, but we recommend using the latest LTS version."}),"\n",(0,s.jsxs)(n.h2,{id:"auto-cleanup",children:["Auto Cleanup",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#auto-cleanup",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"cleanup()"})," function is now called automatically after every test if your testing framework supports ",(0,s.jsx)(n.code,{children:"afterEach"})," hook (like Jest, Mocha, and Jasmine)."]}),"\n",(0,s.jsxs)(n.p,{children:["You should be able to remove all ",(0,s.jsx)(n.code,{children:"afterEach(cleanup)"})," calls in your code."]}),"\n",(0,s.jsxs)(n.p,{children:["This change might break your code, if you tests are not isolated, i.e. you call ",(0,s.jsx)(n.code,{children:"render"})," outside ",(0,s.jsx)(n.code,{children:"test"})," block. Generally, you should ",(0,s.jsx)(n.a,{href:"https://kentcdodds.com/blog/test-isolation-with-react",target:"_blank",rel:"noopener noreferrer",children:"keep your tests isolated"}),". But if you can't or don't want to do this right away you can prevent this behavior using any of the following ways:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["by importing ",(0,s.jsx)(n.code,{children:"'react-native-testing-library/pure'"})," instead of ",(0,s.jsx)(n.code,{children:"'react-native-testing-library'"})]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["by importing ",(0,s.jsx)(n.code,{children:"'react-native-testing-library/dont-cleanup-after-each'"})," before importing ",(0,s.jsx)(n.code,{children:"'react-native-testing-library'"}),". You can do it in a global way by using Jest's ",(0,s.jsx)(n.code,{children:"setupFiles"})," like this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:'{\n  "setupFiles": ["react-native-testing-library/dont-cleanup-after-each"];\n}\n'})}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["by setting ",(0,s.jsx)(n.code,{children:"RNTL_SKIP_AUTO_CLEANUP"})," env variable to ",(0,s.jsx)(n.code,{children:"true"}),". You can do this with ",(0,s.jsx)(n.code,{children:"cross-evn"})," like this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"cross-env RNTL_SKIP_AUTO_CLEANUP=true jest\n"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"waitfor-api-changes",children:["WaitFor API changes",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#waitfor-api-changes",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["We renamed ",(0,s.jsx)(n.code,{children:"waitForElement"})," function to ",(0,s.jsx)(n.code,{children:"waitFor"})," for consistency with React Testing Library. Additionally, the signature has slightly changed from:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-jsx",children:"export default function waitForElement<T>(\n  expectation: () => T,\n  timeout?: number,\n  interval?: number\n): Promise<T> {}\n"})}),"\n",(0,s.jsx)(n.p,{children:"to:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-jsx",children:"export default function waitFor<T>(\n  expectation: () => T,\n  options: {\n    timeout?: number,\n    interval?: number,\n  }\n): Promise<T> {}\n"})}),"\n",(0,s.jsx)(n.p,{children:"Both changes should improve code readibility."}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"waitFor"})," calls (and hence also ",(0,s.jsx)(n.code,{children:"findBy"})," queries) are now wrapped in ",(0,s.jsx)(n.code,{children:"act"})," by default, so that you should no longer need to use ",(0,s.jsx)(n.code,{children:"act"})," directly in your tests."]}),"\n",(0,s.jsxs)(n.div,{className:"rspress-directive tip",children:[(0,s.jsx)(n.div,{className:"rspress-directive-title",children:"TIP"}),(0,s.jsx)(n.div,{className:"rspress-directive-content",children:(0,s.jsxs)(n.p,{children:["You can usually avoid ",(0,s.jsx)(n.code,{children:"waitFor"})," by a proper use of ",(0,s.jsx)(n.code,{children:"findBy"})," asynchronous queries. It will result in more streamlined testing experience.\n"]})})]}),"\n",(0,s.jsxs)(n.h2,{id:"removed-global-debug-function",children:["Removed global ",(0,s.jsx)(n.code,{children:"debug"})," function",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#removed-global-debug-function",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"debug()"})," method returned from ",(0,s.jsx)(n.code,{children:"render()"})," function is all you need. We removed the global export to avoid confusion."]}),"\n",(0,s.jsxs)(n.h2,{id:"removed-global-shallow-function",children:["Removed global ",(0,s.jsx)(n.code,{children:"shallow"})," function",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#removed-global-shallow-function",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Shallow rendering React component is usually not a good idea, so we decided to remove the API. But, if you find it useful or need to support legacy tests, feel free to use this implementation:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"import ShallowRenderer from 'react-test-renderer/shallow';\n\nexport function shallow(instance: ReactTestInstance | React.Element<any>) {\n  const renderer = new ShallowRenderer();\n  renderer.render(React.createElement(instance.type, instance.props));\n\n  return { output: renderer.getRenderOutput() };\n}\n"})}),"\n",(0,s.jsxs)(n.h2,{id:"removed-functions",children:["Removed functions",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#removed-functions",children:"#"})]}),"\n",(0,s.jsx)(n.p,{children:"Following query functions have been removed after being deprecated for more than a year now:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"getByName"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"getAllByName"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"queryByName"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.code,{children:"queryAllByName"})}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"*ByType"})," and ",(0,s.jsx)(n.code,{children:"*ByProps"})," queries has been prefixed with ",(0,s.jsx)(n.code,{children:"UNSAFE_"}),". These ",(0,s.jsx)(n.code,{children:"UNSAFE_"})," functions are not planned for removal in future versions but their usage is discouraged. You can rename them using global search/replace in your project:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"getByType"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_getByType"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"getAllByType"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_getAllByType"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"queryByType"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_queryByType"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"queryAllByType"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_queryAllByType"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"getByProps"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_getByProps"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"getAllByProps"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_getAllByProps"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"queryByProps"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_queryByProps"})]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"queryAllByProps"})," -> ",(0,s.jsx)(n.code,{children:"UNSAFE_queryAllByProps"})]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"some-bytestid-queries-behavior-changes",children:["Some ",(0,s.jsx)(n.code,{children:"ByTestId"})," queries behavior changes",(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#some-bytestid-queries-behavior-changes",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["In version ",(0,s.jsx)(n.code,{children:"1.x"})," the ",(0,s.jsx)(n.code,{children:"getByTestId"})," and ",(0,s.jsx)(n.code,{children:"queryByTestId"})," queries could return non-native instances. This was a serious bug. Other query functions like ",(0,s.jsx)(n.code,{children:"getAllByTestId"}),", ",(0,s.jsx)(n.code,{children:"queryAllByTestId"}),", ",(0,s.jsx)(n.code,{children:"findByTestId"})," and ",(0,s.jsx)(n.code,{children:"findAllByTestId"})," didn't have this issue. These correctly returned only native components instances (e.g. ",(0,s.jsx)(n.code,{children:"View"}),", ",(0,s.jsx)(n.code,{children:"Text"}),", etc) that got the ",(0,s.jsx)(n.code,{children:"testID"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"In v2 we fixed this inconsistency, which may result in failing tests, if you relied on this behavior. There are few ways to handle these failures:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["pass the ",(0,s.jsx)(n.code,{children:"testID"})," prop down so it can reach a native component, like ",(0,s.jsx)(n.code,{children:"View"})," or ",(0,s.jsx)(n.code,{children:"Text"})]}),"\n",(0,s.jsxs)(n.li,{children:["replace ",(0,s.jsx)(n.code,{children:"testID"})," with proper ",(0,s.jsx)(n.code,{children:"accessibilityHint"})," or ",(0,s.jsx)(n.code,{children:"accessibilityLabel"})," if it benefits the user"]}),"\n",(0,s.jsxs)(n.li,{children:["use safe queries like ",(0,s.jsx)(n.code,{children:"*ByText"})," or ",(0,s.jsx)(n.code,{children:"*ByA11yHint"})]}),"\n"]}),"\n",(0,s.jsxs)(n.h2,{id:"deprecated-flushmicrotasksqueue",children:["Deprecated ",(0,s.jsx)(n.code,{children:"flushMicrotasksQueue"}),(0,s.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#deprecated-flushmicrotasksqueue",children:"#"})]}),"\n",(0,s.jsxs)(n.p,{children:["We have deprecated ",(0,s.jsx)(n.code,{children:"flushMicrotasksQueue"})," and plan to remove it in the next major. We have better alternatives available for helping you write async tests \u2013 ",(0,s.jsx)(n.code,{children:"findBy"})," async queries and ",(0,s.jsx)(n.code,{children:"waitFor"})," helper."]}),"\n",(0,s.jsx)(n.p,{children:"If you can't or don't want to migrate your tests, don't worry. You can use the same implementation we have today:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-js",children:"function flushMicrotasksQueue() {\n  return new Promise((resolve) => setImmediate(resolve));\n}\n"})})]})}function t(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,i.ah)(),e.components);return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}n.default=t,t.__RSPRESS_PAGE_META={},t.__RSPRESS_PAGE_META["12.x%2Fdocs%2Fmigration%2Fprevious%2Fv2.mdx"]={toc:[{text:"Dropping Node 8",id:"dropping-node-8",depth:2},{text:"Auto Cleanup",id:"auto-cleanup",depth:2},{text:"WaitFor API changes",id:"waitfor-api-changes",depth:2},{text:"Removed global `debug` function",id:"removed-global-debug-function",depth:2},{text:"Removed global `shallow` function",id:"removed-global-shallow-function",depth:2},{text:"Removed functions",id:"removed-functions",depth:2},{text:"Some `ByTestId` queries behavior changes",id:"some-bytestid-queries-behavior-changes",depth:2},{text:"Deprecated `flushMicrotasksQueue`",id:"deprecated-flushmicrotasksqueue",depth:2}],title:"Migration to 2.x",frontmatter:{}}}}]);