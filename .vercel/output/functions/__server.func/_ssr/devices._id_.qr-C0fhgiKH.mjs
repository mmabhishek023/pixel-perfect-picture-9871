import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/devices._id_.qr-C0fhgiKH.js
var $$splitComponentImporter = () => import("./devices._id_.qr-fkw3amPj.mjs");
var Route = createFileRoute("/devices/$id_/qr")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [
		{ title: "QR Label · ReTech Passport" },
		{
			name: "description",
			content: "Download or print the secure QR label for a device passport."
		},
		{
			property: "og:title",
			content: "QR Label · ReTech Passport"
		},
		{
			property: "og:description",
			content: "Download or print the secure QR label for a device passport."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] })
});
//#endregion
export { Route as t };
