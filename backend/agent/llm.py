from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel
from typing import List, Literal, get_args, get_origin
import random

from dotenv import load_dotenv
load_dotenv()

llm = ChatGoogleGenerativeAI(
  model="gemini-3.1-flash-lite-preview",
  temperature=0.7,
)

def call_llm(prompt: str):
  response = llm.invoke(prompt)
  return response.content

def call_structured_llm(StrcuturedOutputSchema: type[BaseModel], prompt: str) -> dict:
  result = generate_mock(StrcuturedOutputSchema)
  
  # structured_llm = llm.with_structured_output(StrcuturedOutputSchema)
  # result = structured_llm.invoke(prompt)

  if result is None:
    return {}

  return result if isinstance(result, dict) else result.model_dump()

def generate_mock(model: type[BaseModel], index: int = 0) -> BaseModel:
  data = {}

  for name, field in model.model_fields.items():
    field_type = field.annotation
    origin = get_origin(field_type)
    args = get_args(field_type)
    # print("field_type", field_type, "origin", origin, "args_type", args)

    if origin == list:
      args_type = args[0] if args else None
      if hasattr(args_type, "model_fields"):
        data[name] = [generate_mock(args_type, i) for i in range(3)]
      else:
        data[name] = [generate_mock_value(args_type, i) for i in range(3)]

    elif origin == Literal:
      data[name] = random.choice(args)

    elif hasattr(field_type, "model_fields"):
      data[name] = generate_mock(field_type, index)

    else:
      data[name] = generate_mock_value(field_type, index)

  return model(**data)

def generate_mock_value(field_type, index=0):
  if field_type == str:
    return f"mock_{field_type}_{index}"
  elif field_type == int:
    return random.randint(1, 10)
  elif field_type == float:
    return round(random.uniform(0.5, 1.0), 2)
  elif field_type == bool:
    return random.choice([True, False])
  else:
    return None