import React from 'react';

const baseStyle = {
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: '0.4rem',
	minWidth: '6rem',
	padding: '0.55rem 1.25rem',
	borderRadius: '0.5rem',
	border: '1px solid transparent',
	fontSize: '1rem',
	fontWeight: 600,
	lineHeight: 1.1,
	cursor: 'pointer',
	transition: 'transform 120ms ease, box-shadow 120ms ease',
	boxShadow: '0 2px 4px rgba(15, 23, 42, 0.15)'
};

const variantStyles = {
	primary: {
		backgroundColor: '#2563eb',
		borderColor: '#1d4ed8',
		color: '#ffffff'
	},
	secondary: {
		backgroundColor: '#f8fafc',
		borderColor: '#cbd5f5',
		color: '#1f2937'
	},
	danger: {
		backgroundColor: '#ef4444',
		borderColor: '#b91c1c',
		color: '#ffffff'
	}
};

const disabledStyle = {
	opacity: 0.6,
	cursor: 'not-allowed',
	boxShadow: 'none'
};

function Button({
	children,
	variant = 'primary',
	disabled = false,
	onClick,
	type = 'button',
	className = '',
	style,
	...rest
}) {
	const computedStyle = {
		...baseStyle,
		...(variantStyles[variant] ?? variantStyles.primary),
		...(disabled ? disabledStyle : {}),
		...style
	};

	return (
		<button
			type={type}
			className={className}
			disabled={disabled}
			onClick={onClick}
			style={computedStyle}
			{...rest}
		>
			{children}
		</button>
	);
}

export default Button;
