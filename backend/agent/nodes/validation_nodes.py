from agent.llm import call_structured_llm
from agent.states import ValidationState
from agent.prompts.validation_prompts import (
  validate_prompt,
  req_arch_services_prompt, constr_arch_stack_prompt,
  db_api_prompt, api_infra_prompt,
  decision_optimization_prompt
)
from agent.schemas.validation_schemas import ValidationOutput, DecisionOptimizationSchema
from typing import Dict

# Node function for requirements alignment validation
def requirements_alignment_node(state: ValidationState) -> Dict:
	requirements = state.get("requirements", {})
	constraints = state.get("constraints", {})
	architecture = state.get("architecture", {})
	tech_stack = state.get("tech_stack", {})
	services = state.get("design_bundle", {}).get("services", {})
	# infrastructure = state.get("design_bundle", {}).get("infrastructure", {})
    
	requirement_alignment_prompt_details = [
		req_arch_services_prompt.format(
			requirements=requirements,
			architecture=architecture,
			services=services
		),
		constr_arch_stack_prompt.format(
			constraints=constraints,
			architecture=architecture,
			tech_stack=tech_stack
		)
	]
		
	req_align_issues = []
	total_checks = 0
	total_confidence = 0
	
	for detail in requirement_alignment_prompt_details:
		prompt = validate_prompt.format(validation_details=detail)
		result = call_structured_llm(ValidationOutput, prompt)

		issues_list = result.get("issues", [])
		total_checks += result.get("total_checks", 0)
		total_confidence += result.get("confidence", 0)
		req_align_issues.extend(issues_list)

	req_align_report = {
		"issues": req_align_issues,
		"total_checks": total_checks,
		"confidence": total_confidence / len(requirement_alignment_prompt_details)
	}
		
	return {
    "req_align_report": req_align_report
  }


# Node function for cross-component consistency validation
def cross_component_node(state: ValidationState) -> Dict:
	# architecture = state.get("architecture", {})
	# tech_stack = state.get("tech_stack", {})
	db_schema = state.get("design_bundle", {}).get("database_schema", {})
	api_design = state.get("design_bundle", {}).get("api_endpoints", [])
	infrastructure = state.get("design_bundle", {}).get("infrastructure", {})
    
	cross_component_prompt_details = [
		db_api_prompt.format(
			database_design=db_schema,
			api_design=api_design
		),
		api_infra_prompt.format(
			api_design=api_design,
			infrastructure=infrastructure
		)
	]
		
	cross_comp_issues = []
	total_checks = 0
	total_confidence = 0
	
	for detail in cross_component_prompt_details:
		prompt = validate_prompt.format(validation_details=detail)
		result = call_structured_llm(ValidationOutput, prompt)

		issues_list = result.get("issues", [])
		total_checks += result.get("total_checks", 0)
		total_confidence += result.get("confidence", 0)
		cross_comp_issues.extend(issues_list)

	cross_comp_report = {
		"issues": cross_comp_issues,
		"total_checks": total_checks,
		"confidence": total_confidence / len(cross_component_prompt_details)
	}
	
	return {
    "cross_component_report": cross_comp_report
  }


# Node function for design optimization
def decision_optimization_node(state: ValidationState) -> Dict:
	constraints = state.get("constraints", {})
	architecture = state.get("architecture", {})
	tech_stack = state.get("tech_stack", {})
	infra = state.get("design_bundle", {}).get("infrastructure", {})
	
	prompt = decision_optimization_prompt.format(
		constraints=constraints,
		architecture=architecture,
		tech_stack=tech_stack,
		infra=infra
	)
	
	result = call_structured_llm(DecisionOptimizationSchema, prompt)
	
	return {
		"decision_optimizations": result,
	}


# Utility functions for scoring and confidence calculations

SEVERITY_WEIGHTS = {
    "critical": 1.0,
    "major": 0.5,
    "minor": 0.2
}

def compute_module_score(report: Dict) -> float:
    """
    score = 1 - (weighted_failures / total_checks)
    """
    issues = report.get("issues", [])
    total_checks = report.get("total_checks", 0)
    
    if total_checks == 0:
        return 1.0  # no checks → assume perfect

	# weight failures sum by severity
    weighted_failures = sum(SEVERITY_WEIGHTS.get(issue["severity"], 0.5) for issue in issues)
    score = 1 - (weighted_failures / total_checks)

    return max(0.0, min(1.0, score))  # clamp between 0 and 1

def harmonic_mean(a: float, b: float) -> float:
    if a == 0 and b == 0:
        return 0.0
    return 2 * (a * b) / (a + b)

def compute_optimization_score(suggestions):
    if not suggestions:
        return 1.0  # already optimal

    impact_weight = {
        "high": 1.0,
        "medium": 0.5,
        "low": 0.2
    }

    penalties = []

    for s in suggestions:
        impact = impact_weight.get(s["impact"], 0.5)

        # high impact = big missed opportunity → high penalty
        penalties.append(impact)

    avg_penalty = sum(penalties) / len(penalties)

    score = 1 - avg_penalty
    return max(0.0, min(1.0, 0.5+0.5*score))

def compute_pipeline_confidence(state: ValidationState) -> float:
	# Average confidence across all pipeline stages, weighted by importance
	planning_conf = (
		state.get("architecture", {}).get("confidence", 0) * 0.5
		+ state.get("tech_stack", {}).get("confidence", 0) * 0.5
	)

	design_conf = (
		state.get("design_bundle", {}).get("services", {}).get("confidence", 0) * 0.4
		+ state.get("design_bundle", {}).get("database_schema", {}).get("confidence", 0) * 0.2
		+ state.get("design_bundle", {}).get("api_endpoints", {}).get("confidence", 0) * 0.2
		+ state.get("design_bundle", {}).get("infrastructure", {}).get("confidence", 0) * 0.2
	)
    
	validation_confidence = (
		state.get("req_align_report", {}).get("confidence", 0) * 0.4
		+ state.get("cross_component_report", {}).get("confidence", 0) * 0.4
        + state.get("decision_optimizations", {}).get("confidence", 0) * 0.2
	)

	return planning_conf * 0.3 + design_conf * 0.3 + validation_confidence * 0.4


# Scoring Node function for overall design quality
# Scoring Node function for overall design quality
def scoring_node(state: ValidationState) -> Dict:
	"""
	Final scoring pipeline
	"""
	
	ra_report = state.get("req_align_report", {})
	cc_report = state.get("cross_component_report", {})
	suggestions = state.get("decision_optimizations", {}).get("suggestions", [])
	
	confidence = compute_pipeline_confidence(state)
	
	# 1. Module scores
	ra_score = compute_module_score(ra_report)
	cc_score = compute_module_score(cc_report)

	# 2. Combine using harmonic mean
	validation_score = harmonic_mean(ra_score, cc_score)
	
	# 3. Compute optimization score
	optimization_score = compute_optimization_score(suggestions)
	
	# 4. Combine validation score with optimization score
	combined_score = validation_score * 0.7 + optimization_score * 0.3

	# 5. Apply confidence scaling (soft scaling to avoid killing the score)
	final_score = combined_score * (0.5 + 0.5 * confidence)
    
	return {
    "scoring_report": {
			"requirement_alignment_score": round(ra_score, 4),
			"cross_component_score": round(cc_score, 4),
			"optimization_score": round(optimization_score, 4),
			"validation_score": round(validation_score, 4),
			"confidence": round(confidence, 4),
			"final_score": round(final_score, 4)
		},
    "final_score": round(final_score, 4)
	}