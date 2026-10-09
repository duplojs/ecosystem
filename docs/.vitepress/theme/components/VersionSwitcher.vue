<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { useRoute } from "vitepress";
import { documentationVersions, type DocumentationVersionName } from "../../navigation/versions";

defineProps<{
	menu?: boolean;
	screenMenu?: boolean;
}>();

const route = useRoute();
const isOpen = ref(false);
const listId = useId();
let openedByHover = false;

const currentVersion = computed(
	() => getVersionFromPath(route.path),
);

const currentVersionLabel = computed(
	() => documentationVersions.find((version) => version.name === currentVersion.value)?.label ?? currentVersion.value,
);

const versionItems = computed(
	() => documentationVersions
		.map((version) => ({
			...version,
			link: createVersionLink(version.name),
			active: version.name === currentVersion.value,
		}))
		.sort(
			(firstVersion, secondVersion) => Number(secondVersion.active) - Number(firstVersion.active),
		),
);

function toggle() {
	if (isOpen.value && openedByHover) {
		openedByHover = false;
		return;
	}

	openedByHover = false;
	isOpen.value = !isOpen.value;
}

function openOnHover(event: PointerEvent) {
	if (event.pointerType === "mouse") {
		isOpen.value = true;
		openedByHover = true;
	}
}

function closeOnHoverLeave(event: PointerEvent) {
	if (event.pointerType !== "mouse") {
		return;
	}

	const to = event.relatedTarget;

	if (to instanceof Node && event.currentTarget instanceof HTMLElement && event.currentTarget.contains(to)) {
		return;
	}

	isOpen.value = false;
	openedByHover = false;
}

function close() {
	isOpen.value = false;
	openedByHover = false;
}

function getVersionFromPath(path: string): DocumentationVersionName {
	const [, , version] = path.split("/");

	return documentationVersions.some((item) => item.name === version)
		? version as DocumentationVersionName
		: documentationVersions[0].name;
}

function createVersionLink(version: DocumentationVersionName): string {
	const segments = route.path.split("/").filter(Boolean);
	const locale = segments[0] ?? "fr";

	if (!/^v[0-9]+$/.test(segments[1] ?? "")) {
		return `/${locale}/${version}/guide/`;
	}

	return `/${[locale, version, ...segments.slice(2)].join("/")}${route.path.endsWith("/") ? "/" : ""}${route.hash}`;
}

watch(
	() => route.path,
	close,
);
</script>

<template>
	<div
		v-if="screenMenu"
		class="VPNavVersionSwitcher VPNavScreenTranslations"
		:class="{ open: isOpen }"
	>
		<button
			type="button"
			class="title"
			:aria-expanded="isOpen"
			:aria-controls="listId"
			@click="toggle"
		>
			<span
				class="version-icon"
				aria-hidden="true"
			>
				v
			</span>
			{{ currentVersionLabel }}
			<span
				class="vpi-chevron-down icon chevron"
				aria-hidden="true"
			/>
		</button>

		<ul
			v-show="isOpen"
			:id="listId"
			class="list"
		>
			<li
				v-for="version in versionItems"
				:key="version.name"
				class="item"
			>
				<a
					class="link"
					:class="{ active: version.active }"
					:href="version.link"
					@click="close"
				>
					{{ version.label }}
				</a>
			</li>
		</ul>
	</div>

	<div
		v-else-if="menu"
		class="VPNavVersionSwitcher group translations"
	>
		<p class="title">
			{{ currentVersionLabel }}
		</p>

		<ul>
			<li
				v-for="version in versionItems"
				:key="version.name"
				class="VPMenuLink"
			>
				<a
					class="link"
					:class="{ active: version.active }"
					:href="version.link"
					@click="close"
				>
					{{ version.label }}
				</a>
			</li>
		</ul>
	</div>

	<div
		v-else
		class="VPNavVersionSwitcher VPNavBarMenuGroup"
		@pointerenter="openOnHover"
		@pointerleave="closeOnHoverLeave"
	>
		<button
			type="button"
			class="button"
			:aria-expanded="isOpen"
			:aria-controls="listId"
			aria-label="Change documentation version"
			@click="toggle"
		>
			<span class="text">
				<span>
					{{ currentVersionLabel }}
				</span>

				<span
					class="vpi-chevron-down text-icon"
					aria-hidden="true"
				/>
			</span>
		</button>

		<div
			class="menu"
			:class="{ open: isOpen }"
			@pointerleave="closeOnHoverLeave"
		>
			<div class="VPMenu">
				<ul
					:id="listId"
					class="items"
				>
					<li
						v-for="version in versionItems"
						:key="version.name"
						class="VPMenuLink item"
					>
						<a
							class="link"
							:class="{ active: version.active }"
							:href="version.link"
							@click="close"
						>
							{{ version.label }}
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.VPNavVersionSwitcher {
	position: relative;
}

.VPNavVersionSwitcher:hover .text {
	color: var(--vp-c-text-2);
}

.button {
	display: flex;
	align-items: center;
	height: var(--vp-nav-height);
	padding: 0 0.75rem;
	color: var(--vp-c-text-1);
	transition: color 0.5s;
}

.text {
	display: flex;
	align-items: center;
	line-height: var(--vp-nav-height);
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--vp-c-text-1);
	transition: color 0.25s;
}

.text-icon {
	margin-left: 0.25rem;
	font-size: 0.875rem;
}

.menu {
	position: absolute;
	top: calc(var(--vp-nav-height) / 2 + 1.25rem);
	right: 0;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.25s, visibility 0.25s;
}

.button[aria-expanded="true"] + .menu,
.menu.open {
	opacity: 1;
	visibility: visible;
}

.VPMenu {
	max-height: calc(100vh - var(--vp-nav-height));
	min-width: 8rem;
	overflow-y: auto;
	border: 1px solid var(--vp-c-divider);
	border-radius: 0.75rem;
	background-color: var(--vp-c-bg-elv);
	padding: 0.75rem;
	box-shadow: var(--vp-shadow-3);
	transition: background-color 0.5s;
}

.group > .title {
	padding: 0 0.75rem;
	line-height: 2.2857143;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--vp-c-text-2);
}

.VPMenu .item {
	padding: 0 1rem;
	white-space: nowrap;
}

.link {
	display: block;
	border-radius: 0.375rem;
	padding: 0 0.75rem;
	line-height: 2.2857143;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--vp-c-text-1);
	text-align: left;
	white-space: nowrap;
	transition: background-color 0.25s, color 0.25s;
}

.link:hover {
	background-color: var(--vp-c-default-soft);
	color: var(--vp-c-brand-1);
}

.link.active {
	font-weight: 700;
}

.VPNavScreenTranslations {
	border-bottom: 1px solid var(--vp-c-divider);
	transition: border-color 0.5s;
}

.VPNavScreenTranslations .title {
	display: flex;
	align-items: center;
	font-size: 0.875rem;
	font-weight: 500;
	color: var(--vp-c-text-1);
}

.VPNavScreenTranslations .version-icon {
	margin-right: 0.5rem;
	font-size: 1rem;
	font-weight: 700;
}

.VPNavScreenTranslations .icon {
	font-size: 1rem;
}

.VPNavScreenTranslations .icon.chevron {
	margin-left: 0.25rem;
	transition: transform 0.25s;
}

.VPNavScreenTranslations.open .icon.chevron {
	transform: rotate(180deg);
}

.VPNavScreenTranslations .list {
	padding: 0.25rem 0 0 1.5rem;
}

.VPNavScreenTranslations .link {
	border-radius: 0;
	padding: 0;
	line-height: 2.4615385;
	font-size: 0.8125rem;
	font-weight: 400;
	white-space: normal;
}

.VPNavScreenTranslations .link:hover {
	background-color: transparent;
}
</style>
