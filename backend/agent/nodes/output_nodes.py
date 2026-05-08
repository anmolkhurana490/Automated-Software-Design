from agent.states import OutputState
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from typing import Dict, Any

templates_path = (Path(__file__).resolve().parent.parent / "templates").resolve()

env = Environment(
    loader=FileSystemLoader(searchpath=str(templates_path)),
    trim_blocks=True,
    lstrip_blocks=True
)

# helper function to render any dict data into markdown using the appropriate Jinja2 template
def render_dict_to_markdown(data: Any, template_name: str) -> str:
	template = env.get_template(template_name)
     
	key_map = {
    "requirements_output.j2": "requirements",
    "constraints_output.j2": "constraints",
    "architecture_output.j2": "architecture",
    "tech_stack_output.j2": "tech_stack",
    "design_bundle_output.j2": "design_bundle",
  }
	key = key_map.get(template_name, "data")

	return template.render(**{key: data})

# Node function to assemble all generated outputs into a final structured format.
def output_assembler_node(state: OutputState) -> Dict:
  # In a real implementation, this would involve more complex logic to format the output report.
  # For demonstration, we will just merge all available information into a single human readable report.

  md_data = {
    "user_input": state.get("user_input", "N/A"),
    "requirements": render_dict_to_markdown(state.get("requirements", "N/A"), template_name="requirements_output.j2"),
    "constraints": render_dict_to_markdown(state.get("constraints", "N/A"), template_name="constraints_output.j2"),
    "architecture": render_dict_to_markdown(state.get("architecture", "N/A"), template_name="architecture_output.j2"),
    "tech_stack": render_dict_to_markdown(state.get("tech_stack", "N/A"), template_name="tech_stack_output.j2"),
    "design_bundle": render_dict_to_markdown(state.get("design_bundle", "N/A"), template_name="design_bundle_output.j2"),
    "final_score": state.get("final_score", "N/A")
  }

  final_report = render_dict_to_markdown(md_data, template_name="final_report_output.j2")

  return {
    "final_output_report": final_report
  }