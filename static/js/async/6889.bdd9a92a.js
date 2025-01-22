(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([["6889"],{9327:function(e,t,s){"use strict";s.r(t);var n=s("5893"),i=s("65");function a(e){let t=Object.assign({h1:"h1",a:"a",p:"p",h2:"h2",code:"code",h3:"h3",pre:"pre",div:"div",ul:"ul",li:"li"},(0,i.ah)(),e.components);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(t.h1,{id:"jest-matchers",children:["Jest matchers",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#jest-matchers",children:"#"})]}),"\n",(0,n.jsx)(t.p,{children:"This guide describes built-in Jest matchers, we recommend using these matchers as they provide readable tests, accessibility support, and a better developer experience."}),"\n",(0,n.jsxs)(t.h2,{id:"setup",children:["Setup",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#setup",children:"#"})]}),"\n",(0,n.jsxs)(t.p,{children:["There is no need to set up the built-in matchers; they are automatically available in your tests when you import anything from ",(0,n.jsx)(t.code,{children:"@testing-library/react-native"}),", e.g., ",(0,n.jsx)(t.code,{children:"render"}),"."]}),"\n",(0,n.jsxs)(t.h2,{id:"migration-from-legacy-jest-native-matchers",children:["Migration from legacy Jest Native matchers.",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#migration-from-legacy-jest-native-matchers",children:"#"})]}),"\n",(0,n.jsxs)(t.p,{children:["If you are already using legacy Jest Native matchers we have a ",(0,n.jsx)(t.a,{href:"/docs/migration/jest-matchers",children:"migration guide"})," for moving to the built-in matchers."]}),"\n",(0,n.jsxs)(t.h2,{id:"checking-element-existence",children:["Checking element existence",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#checking-element-existence",children:"#"})]}),"\n",(0,n.jsxs)(t.h3,{id:"tobeonthescreen",children:[(0,n.jsx)(t.code,{children:"toBeOnTheScreen()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobeonthescreen",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeOnTheScreen();\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether an element is attached to the element tree or not. If you hold a reference to an element and it gets unmounted during the test it will no longer pass this assertion."}),"\n",(0,n.jsxs)(t.h2,{id:"element-content",children:["Element Content",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#element-content",children:"#"})]}),"\n",(0,n.jsxs)(t.h3,{id:"tohavetextcontent",children:[(0,n.jsx)(t.code,{children:"toHaveTextContent()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohavetextcontent",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveTextContent(\n  text: string | RegExp,\n  options?: {\n    exact?: boolean;\n    normalizer?: (text: string) => string;\n  },\n)\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given element has the given text content or not. It accepts either ",(0,n.jsx)(t.code,{children:"string"})," or ",(0,n.jsx)(t.code,{children:"RegExp"})," matchers, as well as ",(0,n.jsx)(t.a,{href:"/docs/api/queries#text-match-options",children:"text match options"})," of ",(0,n.jsx)(t.code,{children:"exact"})," and ",(0,n.jsx)(t.code,{children:"normalizer"}),"."]}),"\n",(0,n.jsxs)(t.h3,{id:"tocontainelement",children:[(0,n.jsx)(t.code,{children:"toContainElement()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tocontainelement",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(container).toContainElement(\n  element: ReactTestInstance | null,\n)\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether the given container element does contain another host element."}),"\n",(0,n.jsxs)(t.h3,{id:"tobeemptyelement",children:[(0,n.jsx)(t.code,{children:"toBeEmptyElement()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobeemptyelement",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeEmptyElement();\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether the given element does not have any host child elements or text content."}),"\n",(0,n.jsxs)(t.h2,{id:"checking-element-state",children:["Checking element state",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#checking-element-state",children:"#"})]}),"\n",(0,n.jsxs)(t.h3,{id:"tohavedisplayvalue",children:[(0,n.jsx)(t.code,{children:"toHaveDisplayValue()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohavedisplayvalue",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveDisplayValue(\n  value: string | RegExp,\n  options?: {\n    exact?: boolean;\n    normalizer?: (text: string) => string;\n  },\n)\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given ",(0,n.jsx)(t.code,{children:"TextInput"})," element has a specified display value. It accepts either ",(0,n.jsx)(t.code,{children:"string"})," or ",(0,n.jsx)(t.code,{children:"RegExp"})," matchers, as well as ",(0,n.jsx)(t.a,{href:"/docs/api/queries#text-match-options",children:"text match options"})," of ",(0,n.jsx)(t.code,{children:"exact"})," and ",(0,n.jsx)(t.code,{children:"normalizer"}),"."]}),"\n",(0,n.jsxs)(t.h3,{id:"tohaveaccessibilityvalue",children:[(0,n.jsx)(t.code,{children:"toHaveAccessibilityValue()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohaveaccessibilityvalue",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveAccessibilityValue(\n  value: {\n    min?: number;\n    max?: number;\n    now?: number;\n    text?: string | RegExp;\n  },\n)\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether the given element has a specified accessible value."}),"\n",(0,n.jsxs)(t.p,{children:["This matcher will assert accessibility value based on ",(0,n.jsx)(t.code,{children:"aria-valuemin"}),", ",(0,n.jsx)(t.code,{children:"aria-valuemax"}),", ",(0,n.jsx)(t.code,{children:"aria-valuenow"}),", ",(0,n.jsx)(t.code,{children:"aria-valuetext"})," and ",(0,n.jsx)(t.code,{children:"accessibilityValue"})," props. Only defined value entries will be used in the assertion, the element might have additional accessibility value entries and still be matched."]}),"\n",(0,n.jsxs)(t.p,{children:["When querying by ",(0,n.jsx)(t.code,{children:"text"})," entry a string or ",(0,n.jsx)(t.code,{children:"RegExp"})," might be used."]}),"\n",(0,n.jsxs)(t.h3,{id:"tobeenabled",children:[(0,n.jsx)(t.code,{children:"toBeEnabled()"})," / ",(0,n.jsx)(t.code,{children:"toBeDisabled"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobeenabled",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeEnabled();\nexpect(element).toBeDisabled();\n"})}),"\n",(0,n.jsxs)(t.p,{children:["These allow you to assert whether the given element is enabled or disabled from the user's perspective. It relies on the accessibility disabled state as set by ",(0,n.jsx)(t.code,{children:"aria-disabled"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.disabled"})," props. It will consider a given element disabled when it or any of its ancestors is disabled."]}),"\n",(0,n.jsxs)(t.div,{className:"rspress-directive note",children:[(0,n.jsx)(t.div,{className:"rspress-directive-title",children:"NOTE"}),(0,n.jsx)(t.div,{className:"rspress-directive-content",children:(0,n.jsx)(t.p,{children:"These matchers are the negation of each other, and both are provided to avoid double negations in your assertions."})})]}),"\n",(0,n.jsxs)(t.h3,{id:"tobeselected",children:[(0,n.jsx)(t.code,{children:"toBeSelected()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobeselected",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeSelected();\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given element is selected from the user's perspective. It relies on the accessibility selected state as set by ",(0,n.jsx)(t.code,{children:"aria-selected"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.selected"})," props."]}),"\n",(0,n.jsxs)(t.h3,{id:"tobechecked",children:[(0,n.jsx)(t.code,{children:"toBeChecked()"})," / ",(0,n.jsx)(t.code,{children:"toBePartiallyChecked()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobechecked",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeChecked();\nexpect(element).toBePartiallyChecked();\n"})}),"\n",(0,n.jsxs)(t.p,{children:["These allow you to assert whether the given element is checked or partially checked from the user's perspective. It relies on the accessibility checked state as set by ",(0,n.jsx)(t.code,{children:"aria-checked"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.checked"})," props."]}),"\n",(0,n.jsxs)(t.div,{className:"rspress-directive note",children:[(0,n.jsx)(t.div,{className:"rspress-directive-title",children:"NOTE"}),(0,n.jsxs)(t.div,{className:"rspress-directive-content",children:["\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"toBeChecked()"})," matcher works only on ",(0,n.jsx)(t.code,{children:"Switch"})," host elements and accessibility elements with ",(0,n.jsx)(t.code,{children:"checkbox"}),", ",(0,n.jsx)(t.code,{children:"radio"})," or ",(0,n.jsx)(t.code,{children:"switch"})," role."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"toBePartiallyChecked()"})," matcher works only on elements with ",(0,n.jsx)(t.code,{children:"checkbox"})," role."]}),"\n"]}),"\n"]})]}),"\n",(0,n.jsxs)(t.h3,{id:"tobeexpanded",children:[(0,n.jsx)(t.code,{children:"toBeExpanded()"})," / ",(0,n.jsx)(t.code,{children:"toBeCollapsed()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobeexpanded",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeExpanded();\nexpect(element).toBeCollapsed();\n"})}),"\n",(0,n.jsxs)(t.p,{children:["These allows you to assert whether the given element is expanded or collapsed from the user's perspective. It relies on the accessibility disabled state as set by ",(0,n.jsx)(t.code,{children:"aria-expanded"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.expanded"})," props."]}),"\n",(0,n.jsxs)(t.div,{className:"rspress-directive note",children:[(0,n.jsx)(t.div,{className:"rspress-directive-title",children:"NOTE"}),(0,n.jsx)(t.div,{className:"rspress-directive-content",children:(0,n.jsxs)(t.p,{children:["These matchers are the negation of each other for expandable elements (elements with explicit ",(0,n.jsx)(t.code,{children:"aria-expanded"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.expanded"})," props). However, both won't pass for non-expandable elements (ones without explicit ",(0,n.jsx)(t.code,{children:"aria-expanded"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.expanded"})," props).\n"]})})]}),"\n",(0,n.jsxs)(t.h3,{id:"tobebusy",children:[(0,n.jsx)(t.code,{children:"toBeBusy()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobebusy",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeBusy();\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given element is busy from the user's perspective. It relies on the accessibility selected state as set by ",(0,n.jsx)(t.code,{children:"aria-busy"})," or ",(0,n.jsx)(t.code,{children:"accessibilityState.busy"})," props."]}),"\n",(0,n.jsxs)(t.h2,{id:"checking-element-style",children:["Checking element style",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#checking-element-style",children:"#"})]}),"\n",(0,n.jsxs)(t.h3,{id:"tobevisible",children:[(0,n.jsx)(t.code,{children:"toBeVisible()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tobevisible",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toBeVisible();\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether the given element is visible from the user's perspective."}),"\n",(0,n.jsxs)(t.p,{children:["The element is considered invisible when itself or any of its ancestors has ",(0,n.jsx)(t.code,{children:"display: none"})," or ",(0,n.jsx)(t.code,{children:"opacity: 0"})," styles, as well as when it's hidden from accessibility."]}),"\n",(0,n.jsxs)(t.h3,{id:"tohavestyle",children:[(0,n.jsx)(t.code,{children:"toHaveStyle()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohavestyle",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveStyle(\n  style: StyleProp<Style>,\n)\n"})}),"\n",(0,n.jsx)(t.p,{children:"This allows you to assert whether the given element has given styles."}),"\n",(0,n.jsxs)(t.h2,{id:"other-matchers",children:["Other matchers",(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#other-matchers",children:"#"})]}),"\n",(0,n.jsxs)(t.h3,{id:"tohaveaccessiblename",children:[(0,n.jsx)(t.code,{children:"toHaveAccessibleName()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohaveaccessiblename",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveAccessibleName(\n  name?: string | RegExp,\n  options?: {\n    exact?: boolean;\n    normalizer?: (text: string) => string;\n  },\n)\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given element has a specified accessible name. It accepts either ",(0,n.jsx)(t.code,{children:"string"})," or ",(0,n.jsx)(t.code,{children:"RegExp"})," matchers, as well as ",(0,n.jsx)(t.a,{href:"/docs/api/queries#text-match-options",children:"text match options"})," of ",(0,n.jsx)(t.code,{children:"exact"})," and ",(0,n.jsx)(t.code,{children:"normalizer"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["The accessible name will be computed based on ",(0,n.jsx)(t.code,{children:"aria-labelledby"}),", ",(0,n.jsx)(t.code,{children:"accessibilityLabelledBy"}),", ",(0,n.jsx)(t.code,{children:"aria-label"}),", and ",(0,n.jsx)(t.code,{children:"accessibilityLabel"})," props, in the absence of these props, the element text content will be used."]}),"\n",(0,n.jsxs)(t.p,{children:["When the ",(0,n.jsx)(t.code,{children:"name"})," parameter is ",(0,n.jsx)(t.code,{children:"undefined"})," it will only check if the element has any accessible name."]}),"\n",(0,n.jsxs)(t.h3,{id:"tohaveprop",children:[(0,n.jsx)(t.code,{children:"toHaveProp()"}),(0,n.jsx)(t.a,{className:"header-anchor","aria-hidden":"true",href:"#tohaveprop",children:"#"})]}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-ts",children:"expect(element).toHaveProp(\n  name: string,\n  value?: unknown,\n)\n"})}),"\n",(0,n.jsxs)(t.p,{children:["This allows you to assert whether the given element has a given prop. When the ",(0,n.jsx)(t.code,{children:"value"})," parameter is ",(0,n.jsx)(t.code,{children:"undefined"})," it will only check for existence of the prop, and when ",(0,n.jsx)(t.code,{children:"value"})," is defined it will check if the actual value matches passed value."]}),"\n",(0,n.jsxs)(t.div,{className:"rspress-directive note",children:[(0,n.jsx)(t.div,{className:"rspress-directive-title",children:"NOTE"}),(0,n.jsx)(t.div,{className:"rspress-directive-content",children:(0,n.jsx)(t.p,{children:"This matcher should be treated as an escape hatch to be used when all other matchers are not suitable."})})]})]})}function c(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},{wrapper:t}=Object.assign({},(0,i.ah)(),e.components);return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}t.default=c,c.__RSPRESS_PAGE_META={},c.__RSPRESS_PAGE_META["13.x%2Fdocs%2Fapi%2Fjest-matchers.mdx"]={toc:[{text:"Setup",id:"setup",depth:2},{text:"Migration from legacy Jest Native matchers.",id:"migration-from-legacy-jest-native-matchers",depth:2},{text:"Checking element existence",id:"checking-element-existence",depth:2},{text:"`toBeOnTheScreen()`",id:"tobeonthescreen",depth:3},{text:"Element Content",id:"element-content",depth:2},{text:"`toHaveTextContent()`",id:"tohavetextcontent",depth:3},{text:"`toContainElement()`",id:"tocontainelement",depth:3},{text:"`toBeEmptyElement()`",id:"tobeemptyelement",depth:3},{text:"Checking element state",id:"checking-element-state",depth:2},{text:"`toHaveDisplayValue()`",id:"tohavedisplayvalue",depth:3},{text:"`toHaveAccessibilityValue()`",id:"tohaveaccessibilityvalue",depth:3},{text:"`toBeEnabled()` / `toBeDisabled`",id:"tobeenabled",depth:3},{text:"`toBeSelected()`",id:"tobeselected",depth:3},{text:"`toBeChecked()` / `toBePartiallyChecked()`",id:"tobechecked",depth:3},{text:"`toBeExpanded()` / `toBeCollapsed()`",id:"tobeexpanded",depth:3},{text:"`toBeBusy()`",id:"tobebusy",depth:3},{text:"Checking element style",id:"checking-element-style",depth:2},{text:"`toBeVisible()`",id:"tobevisible",depth:3},{text:"`toHaveStyle()`",id:"tohavestyle",depth:3},{text:"Other matchers",id:"other-matchers",depth:2},{text:"`toHaveAccessibleName()`",id:"tohaveaccessiblename",depth:3},{text:"`toHaveProp()`",id:"tohaveprop",depth:3}],title:"Jest matchers",frontmatter:{}}}}]);