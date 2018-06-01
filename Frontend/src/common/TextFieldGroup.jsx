import React from 'react';

const TextFieldGroup = ({field, value, label, error, type, onChange }) => {
	return (
		<div>
			<label className='control-label'>{label}</label>
			<input
				onChange={onChange}
				value={value}
				type={type}
				name={field}
				className="form-control"
			/>
			{error && <span className="help-block">{error}</span>}
			</div>
		);
}
/*
TextFieldGroup.propTypes = {
	field: React.PropTypes.string.isRequired,
	value: React.PropTypes.string.isRequired,
	label: React.PropTypes.string.isRequired,
	error: React.PropTypes.string,
	type: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func.isRequired,
}

만약에 여러분이 만들 컴포넌트가 라이프사이클 API 도 사용하지 않고, 
state 도 사용하지 않고, 그냥 props 만 전달해주면 뷰를 렌더링만 해주는 
역할이라면 함수형 컴포넌트 형식으로 컴포넌트를 정의 할 수 있습니다. 
*/

TextFieldGroup.defaultProps = {
	type: 'text'
}

export default TextFieldGroup;