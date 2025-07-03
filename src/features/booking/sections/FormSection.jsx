import React from "react";

const FormSection = React.memo(({ renderFormComponent }) => {
	return <div>{renderFormComponent()}</div>;
});

FormSection.displayName = "FormSection";

export default FormSection;
