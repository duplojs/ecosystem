export interface GridTemplateContainerProps {
	maxColumns?: number;
	gap?: number;
}

export interface GridTemplateLayoutProps {
	columns?: number;
}

export interface GridTemplateLayoutContainerProps extends GridTemplateContainerProps, GridTemplateLayoutProps {

}
