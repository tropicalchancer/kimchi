"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/projects/page",{

/***/ "(app-pages-browser)/./src/features/projects/hooks/useProjectSearch.ts":
/*!*********************************************************!*\
  !*** ./src/features/projects/hooks/useProjectSearch.ts ***!
  \*********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useProjectSearch: () => (/* binding */ useProjectSearch)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(app-pages-browser)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/debounce */ \"(app-pages-browser)/./node_modules/lodash/debounce.js\");\n/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_2__);\n/* __next_internal_client_entry_do_not_use__ useProjectSearch auto */ \n\n\nfunction useProjectSearch() {\n    const [query, setQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');\n    const [projects, setProjects] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);\n    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);\n    const supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_1__.createClientComponentClient)();\n    const searchProjects = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default()({\n        \"useProjectSearch.useCallback[searchProjects]\": async (searchQuery)=>{\n            if (!searchQuery.trim()) {\n                setProjects([]);\n                return;\n            }\n            setIsLoading(true);\n            setError(null);\n            try {\n                const { data, error: searchError } = await supabase.from('projects').select('id, title, description').ilike('title', \"%\".concat(searchQuery, \"%\")).limit(5);\n                if (searchError) {\n                    throw searchError;\n                }\n                setProjects(data || []);\n            } catch (err) {\n                console.error('Error searching projects:', err);\n                setError(err instanceof Error ? err.message : 'Error searching projects');\n                setProjects([]);\n            } finally{\n                setIsLoading(false);\n            }\n        }\n    }[\"useProjectSearch.useCallback[searchProjects]\"], 300), [\n        supabase\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)({\n        \"useProjectSearch.useEffect\": ()=>{\n            searchProjects(query);\n            return ({\n                \"useProjectSearch.useEffect\": ()=>{\n                    searchProjects.cancel();\n                }\n            })[\"useProjectSearch.useEffect\"];\n        }\n    }[\"useProjectSearch.useEffect\"], [\n        query,\n        searchProjects\n    ]);\n    return {\n        query,\n        setQuery,\n        projects,\n        isLoading,\n        error\n    };\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9mZWF0dXJlcy9wcm9qZWN0cy9ob29rcy91c2VQcm9qZWN0U2VhcmNoLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0VBRXdEO0FBQ21CO0FBQ3JDO0FBUS9CLFNBQVNLO0lBQ2QsTUFBTSxDQUFDQyxPQUFPQyxTQUFTLEdBQUdQLCtDQUFRQSxDQUFDO0lBQ25DLE1BQU0sQ0FBQ1EsVUFBVUMsWUFBWSxHQUFHVCwrQ0FBUUEsQ0FBWSxFQUFFO0lBQ3RELE1BQU0sQ0FBQ1UsV0FBV0MsYUFBYSxHQUFHWCwrQ0FBUUEsQ0FBQztJQUMzQyxNQUFNLENBQUNZLE9BQU9DLFNBQVMsR0FBR2IsK0NBQVFBLENBQWdCO0lBQ2xELE1BQU1jLFdBQVdYLDBGQUEyQkE7SUFFNUMsTUFBTVksaUJBQWlCYixrREFBV0EsQ0FDaENFLHNEQUFRQTt3REFBQyxPQUFPWTtZQUNkLElBQUksQ0FBQ0EsWUFBWUMsSUFBSSxJQUFJO2dCQUN2QlIsWUFBWSxFQUFFO2dCQUNkO1lBQ0Y7WUFFQUUsYUFBYTtZQUNiRSxTQUFTO1lBRVQsSUFBSTtnQkFDRixNQUFNLEVBQUVLLElBQUksRUFBRU4sT0FBT08sV0FBVyxFQUFFLEdBQUcsTUFBTUwsU0FDeENNLElBQUksQ0FBQyxZQUNMQyxNQUFNLENBQUMsMEJBQ1BDLEtBQUssQ0FBQyxTQUFTLElBQWdCLE9BQVpOLGFBQVksTUFDL0JPLEtBQUssQ0FBQztnQkFFVCxJQUFJSixhQUFhO29CQUNmLE1BQU1BO2dCQUNSO2dCQUVBVixZQUFZUyxRQUFRLEVBQUU7WUFDeEIsRUFBRSxPQUFPTSxLQUFLO2dCQUNaQyxRQUFRYixLQUFLLENBQUMsNkJBQTZCWTtnQkFDM0NYLFNBQVNXLGVBQWVFLFFBQVFGLElBQUlHLE9BQU8sR0FBRztnQkFDOUNsQixZQUFZLEVBQUU7WUFDaEIsU0FBVTtnQkFDUkUsYUFBYTtZQUNmO1FBQ0Y7dURBQUcsTUFDSDtRQUFDRztLQUFTO0lBR1piLGdEQUFTQTtzQ0FBQztZQUNSYyxlQUFlVDtZQUNmOzhDQUFPO29CQUNMUyxlQUFlYSxNQUFNO2dCQUN2Qjs7UUFDRjtxQ0FBRztRQUFDdEI7UUFBT1M7S0FBZTtJQUUxQixPQUFPO1FBQ0xUO1FBQ0FDO1FBQ0FDO1FBQ0FFO1FBQ0FFO0lBQ0Y7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2NoYW5jZW1jYWxsaXN0ZXIvUHJvamVjdHMva2ltY2hpL3NyYy9mZWF0dXJlcy9wcm9qZWN0cy9ob29rcy91c2VQcm9qZWN0U2VhcmNoLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50J1xuXG5pbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgY3JlYXRlQ2xpZW50Q29tcG9uZW50Q2xpZW50IH0gZnJvbSAnQHN1cGFiYXNlL2F1dGgtaGVscGVycy1uZXh0anMnXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoL2RlYm91bmNlJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb2plY3Qge1xuICBpZDogc3RyaW5nXG4gIHRpdGxlOiBzdHJpbmdcbiAgZGVzY3JpcHRpb246IHN0cmluZyB8IG51bGxcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVByb2plY3RTZWFyY2goKSB7XG4gIGNvbnN0IFtxdWVyeSwgc2V0UXVlcnldID0gdXNlU3RhdGUoJycpXG4gIGNvbnN0IFtwcm9qZWN0cywgc2V0UHJvamVjdHNdID0gdXNlU3RhdGU8UHJvamVjdFtdPihbXSlcbiAgY29uc3QgW2lzTG9hZGluZywgc2V0SXNMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpXG4gIGNvbnN0IHN1cGFiYXNlID0gY3JlYXRlQ2xpZW50Q29tcG9uZW50Q2xpZW50KClcblxuICBjb25zdCBzZWFyY2hQcm9qZWN0cyA9IHVzZUNhbGxiYWNrKFxuICAgIGRlYm91bmNlKGFzeW5jIChzZWFyY2hRdWVyeTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoIXNlYXJjaFF1ZXJ5LnRyaW0oKSkge1xuICAgICAgICBzZXRQcm9qZWN0cyhbXSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHNldElzTG9hZGluZyh0cnVlKVxuICAgICAgc2V0RXJyb3IobnVsbClcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBkYXRhLCBlcnJvcjogc2VhcmNoRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgICAgICAgLmZyb20oJ3Byb2plY3RzJylcbiAgICAgICAgICAuc2VsZWN0KCdpZCwgdGl0bGUsIGRlc2NyaXB0aW9uJylcbiAgICAgICAgICAuaWxpa2UoJ3RpdGxlJywgYCUke3NlYXJjaFF1ZXJ5fSVgKVxuICAgICAgICAgIC5saW1pdCg1KVxuXG4gICAgICAgIGlmIChzZWFyY2hFcnJvcikge1xuICAgICAgICAgIHRocm93IHNlYXJjaEVycm9yXG4gICAgICAgIH1cblxuICAgICAgICBzZXRQcm9qZWN0cyhkYXRhIHx8IFtdKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNlYXJjaGluZyBwcm9qZWN0czonLCBlcnIpXG4gICAgICAgIHNldEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiAnRXJyb3Igc2VhcmNoaW5nIHByb2plY3RzJylcbiAgICAgICAgc2V0UHJvamVjdHMoW10pXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRJc0xvYWRpbmcoZmFsc2UpXG4gICAgICB9XG4gICAgfSwgMzAwKSxcbiAgICBbc3VwYWJhc2VdXG4gIClcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNlYXJjaFByb2plY3RzKHF1ZXJ5KVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzZWFyY2hQcm9qZWN0cy5jYW5jZWwoKVxuICAgIH1cbiAgfSwgW3F1ZXJ5LCBzZWFyY2hQcm9qZWN0c10pXG5cbiAgcmV0dXJuIHtcbiAgICBxdWVyeSxcbiAgICBzZXRRdWVyeSxcbiAgICBwcm9qZWN0cyxcbiAgICBpc0xvYWRpbmcsXG4gICAgZXJyb3JcbiAgfVxufSAiXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VDYWxsYmFjayIsImNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCIsImRlYm91bmNlIiwidXNlUHJvamVjdFNlYXJjaCIsInF1ZXJ5Iiwic2V0UXVlcnkiLCJwcm9qZWN0cyIsInNldFByb2plY3RzIiwiaXNMb2FkaW5nIiwic2V0SXNMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsInN1cGFiYXNlIiwic2VhcmNoUHJvamVjdHMiLCJzZWFyY2hRdWVyeSIsInRyaW0iLCJkYXRhIiwic2VhcmNoRXJyb3IiLCJmcm9tIiwic2VsZWN0IiwiaWxpa2UiLCJsaW1pdCIsImVyciIsImNvbnNvbGUiLCJFcnJvciIsIm1lc3NhZ2UiLCJjYW5jZWwiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/features/projects/hooks/useProjectSearch.ts\n"));

/***/ })

});