"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/projects/[id]/page",{

/***/ "(app-pages-browser)/./src/features/projects/components/ProjectPosts.tsx":
/*!***********************************************************!*\
  !*** ./src/features/projects/components/ProjectPosts.tsx ***!
  \***********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ProjectPosts: () => (/* binding */ ProjectPosts)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @supabase/auth-helpers-nextjs */ \"(app-pages-browser)/./node_modules/@supabase/auth-helpers-nextjs/dist/index.js\");\n/* harmony import */ var _supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var _ProjectPostForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ProjectPostForm */ \"(app-pages-browser)/./src/features/projects/components/ProjectPostForm.tsx\");\n/* __next_internal_client_entry_do_not_use__ ProjectPosts auto */ \nvar _s = $RefreshSig$();\n\n\n\n\nfunction ProjectPosts(param) {\n    let { projectId } = param;\n    _s();\n    const [posts, setPosts] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const supabase = (0,_supabase_auth_helpers_nextjs__WEBPACK_IMPORTED_MODULE_2__.createClientComponentClient)();\n    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"ProjectPosts.useEffect\": ()=>{\n            const fetchPosts = {\n                \"ProjectPosts.useEffect.fetchPosts\": async ()=>{\n                    const { data, error } = await supabase.from('project_posts').select(\"\\n          id,\\n          content,\\n          created_at,\\n          user_id,\\n          profiles (\\n            username,\\n            avatar_url\\n          )\\n        \").eq('project_id', projectId).order('created_at', {\n                        ascending: false\n                    });\n                    if (error) {\n                        console.error('Error fetching project posts:', error);\n                        setError(error.message);\n                        return;\n                    }\n                    setPosts(data || []);\n                    setError(null);\n                }\n            }[\"ProjectPosts.useEffect.fetchPosts\"];\n            fetchPosts();\n            const channel = supabase.channel('realtime project posts').on('postgres_changes', {\n                event: '*',\n                schema: 'public',\n                table: 'project_posts',\n                filter: \"project_id=eq.\".concat(projectId)\n            }, {\n                \"ProjectPosts.useEffect.channel\": ()=>{\n                    fetchPosts();\n                }\n            }[\"ProjectPosts.useEffect.channel\"]).subscribe();\n            return ({\n                \"ProjectPosts.useEffect\": ()=>{\n                    supabase.removeChannel(channel);\n                }\n            })[\"ProjectPosts.useEffect\"];\n        }\n    }[\"ProjectPosts.useEffect\"], [\n        supabase,\n        router,\n        projectId\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"space-y-4\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ProjectPostForm__WEBPACK_IMPORTED_MODULE_4__.ProjectPostForm, {\n                projectId: projectId\n            }, void 0, false, {\n                fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                lineNumber: 77,\n                columnNumber: 7\n            }, this),\n            error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"bg-red-50 p-4 rounded-lg text-red-700\",\n                children: [\n                    \"Error loading posts: \",\n                    error\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                lineNumber: 80,\n                columnNumber: 9\n            }, this),\n            !error && posts.length === 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"bg-white p-4 rounded-lg shadow text-center text-gray-500\",\n                children: \"No posts yet. Be the first to post in this project!\"\n            }, void 0, false, {\n                fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                lineNumber: 86,\n                columnNumber: 9\n            }, this) : posts.map((post)=>{\n                var _post_profiles, _post_profiles1;\n                return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"bg-white p-4 rounded-lg shadow\",\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"flex items-center mb-2\",\n                            children: [\n                                ((_post_profiles = post.profiles) === null || _post_profiles === void 0 ? void 0 : _post_profiles.avatar_url) ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                                    src: post.profiles.avatar_url,\n                                    alt: post.profiles.username,\n                                    className: \"h-8 w-8 rounded-full mr-2\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                                    lineNumber: 94,\n                                    columnNumber: 17\n                                }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                    className: \"h-8 w-8 rounded-full bg-gray-200 mr-2\"\n                                }, void 0, false, {\n                                    fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                                    lineNumber: 100,\n                                    columnNumber: 17\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    className: \"font-medium\",\n                                    children: ((_post_profiles1 = post.profiles) === null || _post_profiles1 === void 0 ? void 0 : _post_profiles1.username) || 'Unknown User'\n                                }, void 0, false, {\n                                    fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                                    lineNumber: 102,\n                                    columnNumber: 15\n                                }, this)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                            lineNumber: 92,\n                            columnNumber: 13\n                        }, this),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                            className: \"text-gray-800\",\n                            children: post.content\n                        }, void 0, false, {\n                            fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                            lineNumber: 104,\n                            columnNumber: 13\n                        }, this)\n                    ]\n                }, post.id, true, {\n                    fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n                    lineNumber: 91,\n                    columnNumber: 11\n                }, this);\n            })\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/chancemcallister/Projects/kimchi/src/features/projects/components/ProjectPosts.tsx\",\n        lineNumber: 76,\n        columnNumber: 5\n    }, this);\n}\n_s(ProjectPosts, \"issgJoUEcyp0HUWYIkJomugyurc=\", false, function() {\n    return [\n        next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter\n    ];\n});\n_c = ProjectPosts;\nvar _c;\n$RefreshReg$(_c, \"ProjectPosts\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9mZWF0dXJlcy9wcm9qZWN0cy9jb21wb25lbnRzL1Byb2plY3RQb3N0cy50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUUyQztBQUNnQztBQUNoQztBQUNRO0FBaUI1QyxTQUFTSyxhQUFhLEtBQWdDO1FBQWhDLEVBQUVDLFNBQVMsRUFBcUIsR0FBaEM7O0lBQzNCLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHUCwrQ0FBUUEsQ0FBZ0IsRUFBRTtJQUNwRCxNQUFNLENBQUNRLE9BQU9DLFNBQVMsR0FBR1QsK0NBQVFBLENBQWdCO0lBQ2xELE1BQU1VLFdBQVdULDBGQUEyQkE7SUFDNUMsTUFBTVUsU0FBU1QsMERBQVNBO0lBRXhCSCxnREFBU0E7a0NBQUM7WUFDUixNQUFNYTtxREFBYTtvQkFDakIsTUFBTSxFQUFFQyxJQUFJLEVBQUVMLEtBQUssRUFBRSxHQUFHLE1BQU1FLFNBQzNCSSxJQUFJLENBQUMsaUJBQ0xDLE1BQU0sQ0FBRSw4S0FVUkMsRUFBRSxDQUFDLGNBQWNYLFdBQ2pCWSxLQUFLLENBQUMsY0FBYzt3QkFBRUMsV0FBVztvQkFBTTtvQkFFMUMsSUFBSVYsT0FBTzt3QkFDVFcsUUFBUVgsS0FBSyxDQUFDLGlDQUFpQ0E7d0JBQy9DQyxTQUFTRCxNQUFNWSxPQUFPO3dCQUN0QjtvQkFDRjtvQkFFQWIsU0FBU00sUUFBUSxFQUFFO29CQUNuQkosU0FBUztnQkFDWDs7WUFFQUc7WUFFQSxNQUFNUyxVQUFVWCxTQUNiVyxPQUFPLENBQUMsMEJBQ1JDLEVBQUUsQ0FBQyxvQkFBb0I7Z0JBQ3RCQyxPQUFPO2dCQUNQQyxRQUFRO2dCQUNSQyxPQUFPO2dCQUNQQyxRQUFRLGlCQUEyQixPQUFWckI7WUFDM0I7a0RBQUc7b0JBQ0RPO2dCQUNGO2lEQUNDZSxTQUFTO1lBRVo7MENBQU87b0JBQ0xqQixTQUFTa0IsYUFBYSxDQUFDUDtnQkFDekI7O1FBQ0Y7aUNBQUc7UUFBQ1g7UUFBVUM7UUFBUU47S0FBVTtJQUVoQyxxQkFDRSw4REFBQ3dCO1FBQUlDLFdBQVU7OzBCQUNiLDhEQUFDM0IsNkRBQWVBO2dCQUFDRSxXQUFXQTs7Ozs7O1lBRTNCRyx1QkFDQyw4REFBQ3FCO2dCQUFJQyxXQUFVOztvQkFBd0M7b0JBQy9CdEI7Ozs7Ozs7WUFJekIsQ0FBQ0EsU0FBU0YsTUFBTXlCLE1BQU0sS0FBSyxrQkFDMUIsOERBQUNGO2dCQUFJQyxXQUFVOzBCQUEyRDs7Ozs7dUJBSTFFeEIsTUFBTTBCLEdBQUcsQ0FBQyxDQUFDQztvQkFHSkEsZ0JBUzhCQTtxQ0FYbkMsOERBQUNKO29CQUFrQkMsV0FBVTs7c0NBQzNCLDhEQUFDRDs0QkFBSUMsV0FBVTs7Z0NBQ1pHLEVBQUFBLGlCQUFBQSxLQUFLQyxRQUFRLGNBQWJELHFDQUFBQSxlQUFlRSxVQUFVLGtCQUN4Qiw4REFBQ0M7b0NBQ0NDLEtBQUtKLEtBQUtDLFFBQVEsQ0FBQ0MsVUFBVTtvQ0FDN0JHLEtBQUtMLEtBQUtDLFFBQVEsQ0FBQ0ssUUFBUTtvQ0FDM0JULFdBQVU7Ozs7O3lEQUdaLDhEQUFDRDtvQ0FBSUMsV0FBVTs7Ozs7OzhDQUVqQiw4REFBQ1U7b0NBQUtWLFdBQVU7OENBQWVHLEVBQUFBLGtCQUFBQSxLQUFLQyxRQUFRLGNBQWJELHNDQUFBQSxnQkFBZU0sUUFBUSxLQUFJOzs7Ozs7Ozs7Ozs7c0NBRTVELDhEQUFDRTs0QkFBRVgsV0FBVTtzQ0FBaUJHLEtBQUtTLE9BQU87Ozs7Ozs7bUJBYmxDVCxLQUFLVSxFQUFFOzs7Ozs7Ozs7Ozs7QUFtQjNCO0dBdkZnQnZDOztRQUlDRixzREFBU0E7OztLQUpWRSIsInNvdXJjZXMiOlsiL1VzZXJzL2NoYW5jZW1jYWxsaXN0ZXIvUHJvamVjdHMva2ltY2hpL3NyYy9mZWF0dXJlcy9wcm9qZWN0cy9jb21wb25lbnRzL1Byb2plY3RQb3N0cy50c3giXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9hdXRoLWhlbHBlcnMtbmV4dGpzJ1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9uYXZpZ2F0aW9uJ1xuaW1wb3J0IHsgUHJvamVjdFBvc3RGb3JtIH0gZnJvbSAnLi9Qcm9qZWN0UG9zdEZvcm0nXG5cbmludGVyZmFjZSBQcm9qZWN0UG9zdCB7XG4gIGlkOiBzdHJpbmdcbiAgY29udGVudDogc3RyaW5nXG4gIGNyZWF0ZWRfYXQ6IHN0cmluZ1xuICB1c2VyX2lkOiBzdHJpbmdcbiAgcHJvZmlsZXM6IHtcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgYXZhdGFyX3VybDogc3RyaW5nIHwgbnVsbFxuICB9XG59XG5cbmludGVyZmFjZSBQcm9qZWN0UG9zdHNQcm9wcyB7XG4gIHByb2plY3RJZDogc3RyaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0UG9zdHMoeyBwcm9qZWN0SWQgfTogUHJvamVjdFBvc3RzUHJvcHMpIHtcbiAgY29uc3QgW3Bvc3RzLCBzZXRQb3N0c10gPSB1c2VTdGF0ZTxQcm9qZWN0UG9zdFtdPihbXSlcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKVxuICBjb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCgpXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBmZXRjaFBvc3RzID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcbiAgICAgICAgLmZyb20oJ3Byb2plY3RfcG9zdHMnKVxuICAgICAgICAuc2VsZWN0KGBcbiAgICAgICAgICBpZCxcbiAgICAgICAgICBjb250ZW50LFxuICAgICAgICAgIGNyZWF0ZWRfYXQsXG4gICAgICAgICAgdXNlcl9pZCxcbiAgICAgICAgICBwcm9maWxlcyAoXG4gICAgICAgICAgICB1c2VybmFtZSxcbiAgICAgICAgICAgIGF2YXRhcl91cmxcbiAgICAgICAgICApXG4gICAgICAgIGApXG4gICAgICAgIC5lcSgncHJvamVjdF9pZCcsIHByb2plY3RJZClcbiAgICAgICAgLm9yZGVyKCdjcmVhdGVkX2F0JywgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXG5cbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBwcm9qZWN0IHBvc3RzOicsIGVycm9yKVxuICAgICAgICBzZXRFcnJvcihlcnJvci5tZXNzYWdlKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgc2V0UG9zdHMoZGF0YSB8fCBbXSlcbiAgICAgIHNldEVycm9yKG51bGwpXG4gICAgfVxuXG4gICAgZmV0Y2hQb3N0cygpXG5cbiAgICBjb25zdCBjaGFubmVsID0gc3VwYWJhc2VcbiAgICAgIC5jaGFubmVsKCdyZWFsdGltZSBwcm9qZWN0IHBvc3RzJylcbiAgICAgIC5vbigncG9zdGdyZXNfY2hhbmdlcycsIHtcbiAgICAgICAgZXZlbnQ6ICcqJyxcbiAgICAgICAgc2NoZW1hOiAncHVibGljJyxcbiAgICAgICAgdGFibGU6ICdwcm9qZWN0X3Bvc3RzJyxcbiAgICAgICAgZmlsdGVyOiBgcHJvamVjdF9pZD1lcS4ke3Byb2plY3RJZH1gXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIGZldGNoUG9zdHMoKVxuICAgICAgfSlcbiAgICAgIC5zdWJzY3JpYmUoKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1cGFiYXNlLnJlbW92ZUNoYW5uZWwoY2hhbm5lbClcbiAgICB9XG4gIH0sIFtzdXBhYmFzZSwgcm91dGVyLCBwcm9qZWN0SWRdKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cbiAgICAgIDxQcm9qZWN0UG9zdEZvcm0gcHJvamVjdElkPXtwcm9qZWN0SWR9IC8+XG4gICAgICBcbiAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctcmVkLTUwIHAtNCByb3VuZGVkLWxnIHRleHQtcmVkLTcwMFwiPlxuICAgICAgICAgIEVycm9yIGxvYWRpbmcgcG9zdHM6IHtlcnJvcn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgXG4gICAgICB7IWVycm9yICYmIHBvc3RzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTQgcm91bmRlZC1sZyBzaGFkb3cgdGV4dC1jZW50ZXIgdGV4dC1ncmF5LTUwMFwiPlxuICAgICAgICAgIE5vIHBvc3RzIHlldC4gQmUgdGhlIGZpcnN0IHRvIHBvc3QgaW4gdGhpcyBwcm9qZWN0IVxuICAgICAgICA8L2Rpdj5cbiAgICAgICkgOiAoXG4gICAgICAgIHBvc3RzLm1hcCgocG9zdCkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtwb3N0LmlkfSBjbGFzc05hbWU9XCJiZy13aGl0ZSBwLTQgcm91bmRlZC1sZyBzaGFkb3dcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgbWItMlwiPlxuICAgICAgICAgICAgICB7cG9zdC5wcm9maWxlcz8uYXZhdGFyX3VybCA/IChcbiAgICAgICAgICAgICAgICA8aW1nXG4gICAgICAgICAgICAgICAgICBzcmM9e3Bvc3QucHJvZmlsZXMuYXZhdGFyX3VybH1cbiAgICAgICAgICAgICAgICAgIGFsdD17cG9zdC5wcm9maWxlcy51c2VybmFtZX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtOCB3LTggcm91bmRlZC1mdWxsIG1yLTJcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLTggdy04IHJvdW5kZWQtZnVsbCBiZy1ncmF5LTIwMCBtci0yXCIgLz5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1tZWRpdW1cIj57cG9zdC5wcm9maWxlcz8udXNlcm5hbWUgfHwgJ1Vua25vd24gVXNlcid9PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktODAwXCI+e3Bvc3QuY29udGVudH08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpXG4gICAgICApfVxuICAgIDwvZGl2PlxuICApXG59ICJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsImNyZWF0ZUNsaWVudENvbXBvbmVudENsaWVudCIsInVzZVJvdXRlciIsIlByb2plY3RQb3N0Rm9ybSIsIlByb2plY3RQb3N0cyIsInByb2plY3RJZCIsInBvc3RzIiwic2V0UG9zdHMiLCJlcnJvciIsInNldEVycm9yIiwic3VwYWJhc2UiLCJyb3V0ZXIiLCJmZXRjaFBvc3RzIiwiZGF0YSIsImZyb20iLCJzZWxlY3QiLCJlcSIsIm9yZGVyIiwiYXNjZW5kaW5nIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJjaGFubmVsIiwib24iLCJldmVudCIsInNjaGVtYSIsInRhYmxlIiwiZmlsdGVyIiwic3Vic2NyaWJlIiwicmVtb3ZlQ2hhbm5lbCIsImRpdiIsImNsYXNzTmFtZSIsImxlbmd0aCIsIm1hcCIsInBvc3QiLCJwcm9maWxlcyIsImF2YXRhcl91cmwiLCJpbWciLCJzcmMiLCJhbHQiLCJ1c2VybmFtZSIsInNwYW4iLCJwIiwiY29udGVudCIsImlkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/features/projects/components/ProjectPosts.tsx\n"));

/***/ })

});