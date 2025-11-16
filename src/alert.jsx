import React from 'react';

const baseStyle = {
	display: 'flex',
	gap: '0.6rem',
	alignItems: 'flex-start',
	width: '100%',
	padding: '0.75rem 1rem',
	borderRadius: '0.65rem',
	border: '1px solid transparent',
	fontSize: '0.95rem',
	lineHeight: 1.4,
	backgroundColor: '#f8fafc',
	color: '#0f172a'
};

const variantStyles = {
	info: {
		backgroundColor: '#eff6ff',
		borderColor: '#bfdbfe',
		color: '#1d4ed8'
	},
	success: {
		backgroundColor: '#ecfdf5',
		borderColor: '#bbf7d0',
		color: '#15803d'
	},
	warning: {
		backgroundColor: '#fef9c3',
		borderColor: '#fde68a',
		color: '#b45309'
	},
	danger: {
		backgroundColor: '#fee2e2',
		borderColor: '#fecaca',
		color: '#b91c1c'
	}
};

const titleStyle = {
	fontWeight: 600,
	fontSize: '1rem'
};

const messageStyle = {
	margin: 0
};

const iconMap = {
	info: 'ℹ️',
	success: '✅',
	warning: '⚠️',
	danger: '⛔'
};

function Alert({
	title,
	children,
	variant = 'info',
	dismissible = false,
	onDismiss,
	className = '',
	style,
	icon,
	...rest
}) {
	const computedStyle = {
		...baseStyle,
		...(variantStyles[variant] ?? variantStyles.info),
		...style
	};

	const resolvedIcon = icon ?? iconMap[variant] ?? iconMap.info;

	return (
		<div role="alert" className={className} style={computedStyle} {...rest}>
			<span aria-hidden="true" style={{ fontSize: '1.3rem', lineHeight: 1 }}>
				{resolvedIcon}
			</span>
			<div style={{ flex: 1 }}>
				{title ? <div style={titleStyle}>{title}</div> : null}
				{children ? <p style={messageStyle}>{children}</p> : null}
			</div>
			{dismissible ? (
				<button
					type="button"
					onClick={onDismiss}
					aria-label="Dismiss alert"
					style={{
						marginLeft: '0.5rem',
						background: 'transparent',
						border: 'none',
						cursor: 'pointer',
						color: 'inherit',
						fontSize: '1.1rem',
						lineHeight: 1
					}}
				>
					×
				</button>
			) : null}
		</div>
	);
}

export default Alert;
