/* __placeholder__ */
// import 
export default (await import('vue')).defineComponent({
name: "Terms",
components: {},
setup() {
function previewPDF() {
const pdfUrl = 'path/to/your/pdf/file.pdf';

// Load the PDF file using PDF.js
pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
const numPages = pdf.numPages;
const previewContainer = document.getElementById('pdfPreview');
previewContainer.innerHTML = '';

// Render each page of the PDF
for (let pageNum = 1; pageNum <= numPages; pageNum++) {
pdf.getPage(pageNum).then(function (page) {
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const viewport = page.getViewport({ scale: 1.5 });
canvas.width = viewport.width;
canvas.height = viewport.height;

const renderContext = {
canvasContext: context,
viewport: viewport
};

page.render(renderContext).promise.then(function () {
previewContainer.appendChild(canvas);
});
});
}
});
}
}
});
const __VLS_componentsOption = {};
const __VLS_name = "Terms" as const;
function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {};
({} as __VLS_IntrinsicElements).div; ({} as __VLS_IntrinsicElements).div;
{
const __VLS_0 = ({} as __VLS_IntrinsicElements)["div"];
const __VLS_1 = __VLS_elementAsFunctionalComponent(__VLS_0);
({} as __VLS_IntrinsicElements).div;
({} as __VLS_IntrinsicElements).div;
const __VLS_2 = __VLS_1({ ...{}, id: ("pdfPreview"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_0, typeof __VLS_2> & Record<string, unknown>) => void)({ ...{}, id: ("pdfPreview"), });
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
return __VLS_slots;
}
let __VLS_internalComponent!: typeof import('./Terms.vue')['default'];
