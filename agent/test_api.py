from langchain_nvidia_ai_endpoints import ChatNVIDIA

llm = ChatNVIDIA(model="nvidia/nemotron-mini-4b-instruct", temperature=0.7, api_key = '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')
print()
response = llm.invoke("How do you change colors in Davinci resolve?")
print()
print(response.content)

