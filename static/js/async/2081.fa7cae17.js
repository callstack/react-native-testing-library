(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["2081"],{8856:function(e,n,t){"use strict";t.r(n);var i=t("5893"),r=t("65");function s(e){let n=Object.assign({h1:"h1",a:"a",h2:"h2",code:"code",pre:"pre",h3:"h3",p:"p"},(0,r.ah)(),e.components);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(n.h1,{id:"configuration",children:["Configuration",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#configuration",children:"#"})]}),"\n",(0,i.jsxs)(n.h2,{id:"configure",children:[(0,i.jsx)(n.code,{children:"configure"}),(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#configure",children:"#"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"type Config = {\n  asyncUtilTimeout: number;\n  defaultHidden: boolean;\n  defaultDebugOptions: Partial<DebugOptions>;\n  concurrentRoot: boolean;\n};\n\nfunction configure(options: Partial<Config>) {}\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"asyncutiltimeout-option",children:[(0,i.jsx)(n.code,{children:"asyncUtilTimeout"})," option",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#asyncutiltimeout-option",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Default timeout, in ms, for async helper functions (",(0,i.jsx)(n.code,{children:"waitFor"}),", ",(0,i.jsx)(n.code,{children:"waitForElementToBeRemoved"}),") and ",(0,i.jsx)(n.code,{children:"findBy*"})," queries. Defaults to 1000 ms."]}),"\n",(0,i.jsxs)(n.h3,{id:"defaultincludehiddenelements-option",children:[(0,i.jsx)(n.code,{children:"defaultIncludeHiddenElements"})," option",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#defaultincludehiddenelements-option",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Default value for ",(0,i.jsx)(n.a,{href:"/docs/api/queries#includehiddenelements-option",children:"includeHiddenElements"})," query option for all queries. The default value is set to ",(0,i.jsx)(n.code,{children:"false"}),", so all queries will not match ",(0,i.jsx)(n.a,{href:"#ishiddenfromaccessibility",children:"elements hidden from accessibility"}),". This is because the users of the app would not be able to see such elements."]}),"\n",(0,i.jsxs)(n.p,{children:["This option is also available as ",(0,i.jsx)(n.code,{children:"defaultHidden"})," alias for compatibility with ",(0,i.jsx)(n.a,{href:"https://testing-library.com/docs/dom-testing-library/api-configuration/#defaulthidden",target:"_blank",rel:"noopener noreferrer",children:"React Testing Library"}),"."]}),"\n",(0,i.jsxs)(n.h3,{id:"defaultdebugoptions-option",children:[(0,i.jsx)(n.code,{children:"defaultDebugOptions"})," option",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#defaultdebugoptions-option",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Default ",(0,i.jsx)(n.a,{href:"#debug",children:"debug options"})," to be used when calling ",(0,i.jsx)(n.code,{children:"debug()"}),". These default options will be overridden by the ones you specify directly when calling ",(0,i.jsx)(n.code,{children:"debug()"}),"."]}),"\n",(0,i.jsxs)(n.h3,{id:"concurrentroot-option",children:[(0,i.jsx)(n.code,{children:"concurrentRoot"})," option",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#concurrentroot-option",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Set to ",(0,i.jsx)(n.code,{children:"true"})," to enable concurrent rendering used in the React Native New Architecture. Otherwise ",(0,i.jsx)(n.code,{children:"render"})," will default to legacy synchronous rendering."]}),"\n",(0,i.jsxs)(n.h2,{id:"resettodefaults",children:[(0,i.jsx)(n.code,{children:"resetToDefaults()"}),(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#resettodefaults",children:"#"})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"function resetToDefaults() {}\n"})}),"\n",(0,i.jsxs)(n.h2,{id:"environment-variables",children:["Environment variables",(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#environment-variables",children:"#"})]}),"\n",(0,i.jsxs)(n.h3,{id:"rntl_skip_auto_cleanup",children:[(0,i.jsx)(n.code,{children:"RNTL_SKIP_AUTO_CLEANUP"}),(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rntl_skip_auto_cleanup",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Set to ",(0,i.jsx)(n.code,{children:"true"})," to disable automatic ",(0,i.jsx)(n.code,{children:"cleanup()"})," after each test. It works the same as importing ",(0,i.jsx)(n.code,{children:"react-native-testing-library/dont-cleanup-after-each"})," or using ",(0,i.jsx)(n.code,{children:"react-native-testing-library/pure"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ RNTL_SKIP_AUTO_CLEANUP=true jest\n"})}),"\n",(0,i.jsxs)(n.h3,{id:"rntl_skip_auto_detect_fake_timers",children:[(0,i.jsx)(n.code,{children:"RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS"}),(0,i.jsx)(n.a,{className:"header-anchor","aria-hidden":"true",href:"#rntl_skip_auto_detect_fake_timers",children:"#"})]}),"\n",(0,i.jsxs)(n.p,{children:["Set to ",(0,i.jsx)(n.code,{children:"true"})," to disable auto-detection of fake timers. This might be useful in rare cases when you want to use non-Jest fake timers. See ",(0,i.jsx)(n.a,{href:"https://github.com/callstack/react-native-testing-library/issues/886",target:"_blank",rel:"noopener noreferrer",children:"issue #886"})," for more details."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS=true jest\n"})})]})}function a(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:n}=Object.assign({},(0,r.ah)(),e.components);return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(s,{...e})}):s(e)}n.default=a,a.__RSPRESS_PAGE_META={},a.__RSPRESS_PAGE_META["13.x%2Fdocs%2Fapi%2Fmisc%2Fconfig.mdx"]={toc:[{text:"`configure`",id:"configure",depth:2},{text:"`asyncUtilTimeout` option",id:"asyncutiltimeout-option",depth:3},{text:"`defaultIncludeHiddenElements` option",id:"defaultincludehiddenelements-option",depth:3},{text:"`defaultDebugOptions` option",id:"defaultdebugoptions-option",depth:3},{text:"`concurrentRoot` option",id:"concurrentroot-option",depth:3},{text:"`resetToDefaults()`",id:"resettodefaults",depth:2},{text:"Environment variables",id:"environment-variables",depth:2},{text:"`RNTL_SKIP_AUTO_CLEANUP`",id:"rntl_skip_auto_cleanup",depth:3},{text:"`RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS`",id:"rntl_skip_auto_detect_fake_timers",depth:3}],title:"Configuration",frontmatter:{}}}}]);