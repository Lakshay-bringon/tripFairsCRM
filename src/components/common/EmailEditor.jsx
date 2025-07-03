import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	Alignment,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockToolbar,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	ImageEditing,
	ImageUtils,
	Indent,
	IndentBlock,
	Italic,
	Link,
	Paragraph,
	PlainTableOutput,
	RemoveFormat,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableLayout,
	TableProperties,
	TableToolbar,
	Underline,
	GeneralHtmlSupport,
	Undo,
	List,
	HorizontalLine,
	HtmlEmbed,
	ImageInsert,
	ImageResize,
	ImageUpload,
	Image,
	SimpleUploadAdapter,
	ImageStyle,
	ImageToolbar,
	ImageCaption,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
export default function EmailEditor({
	initialHtml = '',
	onSave,
	onCancel,
	isSaving = false,
}) {
	const [editorData, setEditorData] = useState('');
	const [isEditorReady, setIsEditorReady] = useState(false);
	const editorRef = useRef(null);

	// Set initial data when component mounts or initialHtml changes
	useEffect(() => {
		// console.log(
		// 	"EmailEditor: initialHtml received:",
		// 	initialHtml?.substring(0, 100) + "..."
		// );
		if (initialHtml) {
			setEditorData(initialHtml);
		}
	}, [initialHtml]);

	const handleSave = () => {
		// console.log('Saving editor data:', editorData?.substring(0, 100) + '...');
		const emailAfterEdit = editorRef.current.data.get();
		if (!emailAfterEdit) {
			// console.error('No content to save');
			return;
		}
		if (onSave) {
			onSave(emailAfterEdit);
		}
	};

	const handleCancel = () => {
		setEditorData(initialHtml); // Reset to original content
		if (onCancel) {
			onCancel();
		}
	};
	const editorConfiguration = {
		licenseKey: 'GPL',

		removePlugins: ['ClassicHTMLFeatures'],
		plugins: [
			SimpleUploadAdapter,
			Image,
			ImageUpload,
			ImageInsert,
			ImageResize,
			ImageStyle,
			ImageToolbar,
			ImageEditing,
			ImageCaption,
			ImageUtils,
			Undo,
			List,
			HorizontalLine,
			GeneralHtmlSupport,
			Alignment,
			AutoLink,
			Autosave,
			BalloonToolbar,
			BlockToolbar,
			Bold,
			Essentials,
			FontBackgroundColor,
			FontColor,
			FontFamily,
			FontSize,
			Heading,
			ImageEditing,
			ImageUtils,
			Indent,
			IndentBlock,
			Italic,
			Link,
			Paragraph,
			PlainTableOutput,
			RemoveFormat,
			Strikethrough,
			Table,
			TableCaption,
			TableCellProperties,
			TableColumnResize,
			TableLayout,
			TableProperties,
			TableToolbar,
			Underline,
			HtmlEmbed,
		],
		toolbar: {
			items: [
				'undo',
				'redo',
				'|',
				'heading',
				'|',
				'fontSize',
				'fontFamily',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bold',
				'italic',
				'underline',
				'|',
				'link',
				'insertTable',
				'insertTableLayout',
				'imageInsert',
				'|',
				'alignment',
				'|',
				'outdent',
				'indent',
			],
			shouldNotGroupWhenFull: false,
		},
		heading: {
			options: [
				{
					model: 'paragraph',
					title: 'Paragraph',
					class: 'ck-heading_paragraph',
				},
				{
					model: 'heading1',
					view: 'h1',
					title: 'Heading 1',
					class: 'ck-heading_heading1',
				},
				{
					model: 'heading2',
					view: 'h2',
					title: 'Heading 2',
					class: 'ck-heading_heading2',
				},
				{
					model: 'heading3',
					view: 'h3',
					title: 'Heading 3',
					class: 'ck-heading_heading3',
				},
				{
					model: 'heading4',
					view: 'h4',
					title: 'Heading 4',
					class: 'ck-heading_heading4',
				},
				{
					model: 'heading5',
					view: 'h5',
					title: 'Heading 5',
					class: 'ck-heading_heading5',
				},
				{
					model: 'heading6',
					view: 'h6',
					title: 'Heading 6',
					class: 'ck-heading_heading6',
				},
			],
		},
		balloonToolbar: ['bold', 'italic', '|', 'link', 'imageUpload'],
		blockToolbar: [
			'fontSize',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'|',
			'link',
			'insertTable',
			'insertTableLayout',
			'imageUpload',
			'|',
			'outdent',
			'indent',
		],
		fontFamily: {
			supportAllValues: true,
		},
		fontSize: {
			options: [10, 12, 14, 'default', 18, 20, 22],
			supportAllValues: true,
		},

		htmlSupport: {
			allow: [
				{
					name: /.*/,
					attributes: true,
					classes: true,
					styles: true,
				},
			],
		},

		link: {
			addTargetToExternalLinks: true,
			defaultProtocol: 'https://',
			decorators: {
				toggleDownloadable: {
					mode: 'manual',
					label: 'Downloadable',
					attributes: {
						download: 'file',
					},
				},
			},
		},
		menuBar: {
			isVisible: true,
		},
		image: {
			toolbar: [
				'imageTextAlternative',
				'imageStyle:alignLeft',
				'imageStyle:alignCenter',
				'imageStyle:alignRight',
				'imageStyle:inline',
				'imageStyle:block',
			],
			styles: ['alignLeft', 'alignCenter', 'alignRight', 'inline', 'block'],
		},
		placeholder: 'Type or paste your content here!',
		table: {
			// contentToolbar: [
			// 	"tableColumn",
			// 	"tableRow",
			// 	"mergeTableCells",
			// 	"tableProperties",
			// 	"tableCellProperties",
			// ],
		},
		stylesConverter: {
			toItem: (style) => style,
			toStyle: (item) => item,
		},
	};

	return (
		<div className="w-full h-full flex flex-col bg-gray-900">
			{/* Header with Save and Cancel buttons */}
			<div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-600">
				<h2 className="text-lg font-semibold text-white">Edit Email Content</h2>
				<div className="flex gap-3">
					<button
						onClick={handleCancel}
						disabled={isSaving}
						className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						disabled={isSaving || !isEditorReady}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSaving ? 'Saving...' : 'Save Changes'}
					</button>
				</div>
			</div>{' '}
			{/* CKEditor Container */}
			<div className="flex-1 p-4 overflow-auto">
				<div className="bg-white rounded-lg overflow-auto shadow-lg h-full email-editor-container">
					{editorData ? (
						<CKEditor
							editor={ClassicEditor}
							config={editorConfiguration}
							data={editorData}
							onReady={(editor) => {
								editorRef.current = editor;
								// console.log(editorRef.current);
								setIsEditorReady(true);
								// console.log(
								// 	'Editor is ready! Initial data length:',
								// 	editorData?.length
								// );
							}}
							onChange={(event, editor) => {
								const data = editor.getData();
								setEditorData(data);
								console.log(
									'Editor content changed, new length:',
									data?.length
								);
							}}
							onError={(error) => {
								// console.error('CKEditor error:', error);
							}}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							<div className="text-center">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
								<p>No content available to edit.</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
