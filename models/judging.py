from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.schema import BaseOutputParser
from langchain.memory import ConversationSummaryMemory
from langchain.chains import ConversationChain

# Step 1: Define the output parser
class JudgingOutputParser(BaseOutputParser):
    def parse(self, text):
        # Initialize default values
        score = "N/A"
        feedback = "N/A"
        toppers_answer = "N/A"
        framework = "N/A"
        points = "N/A"
        data_sources = "N/A"
        
        # Extract score
        if "Score: " in text:
            score = text.split("Score: ")[1].split("\n")[0]
        
        # Extract feedback
        if "Feedback: " in text:
            feedback = text.split("Feedback: ")[1].split("\n")[0]
        
        # Extract topper's answer
        if "Topper's Answer: " in text:
            toppers_answer = text.split("Topper's Answer: ")[1].split("\n")[0]
        
        # Extract framework
        if "Framework: " in text:
            framework = text.split("Framework: ")[1].split("\n")[0]
        
        # Extract points
        if "Points: " in text:
            points = text.split("Points: ")[1].split("\n")[0]
        
        # Extract data sources
        if "Data Sources: " in text:
            data_sources = text.split("Data Sources: ")[1].strip()
        
        return {
            "score": score,
            "feedback": feedback,
            "toppers_answer": toppers_answer,
            "framework": framework,
            "points": points,
            "data_sources": data_sources
        }

# Step 2: Define the prompt template
prompt_template = PromptTemplate(
    input_variables=["user_writing", "question", "toppers_answers", "history"],
    template="""
    Evaluate the following writing sample and provide detailed feedback in the EXACT format specified below:
    
    Previous Interactions:
    {history}
    
    Question:
    {question}
    
    User's Writing:
    {user_writing}
    
    Toppers' Answers:
    {toppers_answers}
    
    Provide output in the following EXACT format:
    Score: [score]/10
    Feedback: [detailed feedback, including how to improve in a friendly way]
    Topper's Answer: [generate a topper's answer on the same topic, taking framework and style from the examples in toppers_answers_scientific and toppers_answers_descriptive]
    Framework: [the framework used by the topper]
    Points: [the key points that make the topper's answer better]
    Data Sources: [sources for the user to practice from, e.g., newspapers, books, websites]
    
    IMPORTANT: Do not deviate from this format. Ensure all fields are included.
    """
)

# Step 3: Initialize Summarizer Memory
memory = ConversationSummaryMemory(llm=llm)

# Step 4: Create the LLMChain with Memory
judging_chain = LLMChain(
    llm=llm,
    prompt=prompt_template,
    memory=memory,
    output_parser=JudgingOutputParser()
)

# Step 5: Define the judging function
def judge_writing(user_writing, question, topic):
    # Retrieve toppers' answers for the given topic
    if topic == "scientific":
        toppers_answers_for_topic = toppers_answers_scientific
    elif topic == "descriptive":
        toppers_answers_for_topic = toppers_answers_descriptive
    else:
        raise ValueError(f"Invalid topic: {topic}. Supported topics are 'scientific' and 'descriptive'.")
    
    # Format toppers' answers for the prompt
    formatted_toppers_answers = "\n\n".join(
        f"Topper Answer {i+1}:\nQuestion: {ans['question']}\nAnswer: {ans['answer']}\nScore: {ans['score']}\nFramework: {ans['framework']}\nWriting Style: {ans['writing_style']}\nPoints to Improve: {ans['points_to_improve']}"
        for i, ans in enumerate(toppers_answers_for_topic)
    )
    
    # Run the judging chain
    result = judging_chain.run(user_writing=user_writing, question=question, toppers_answers=formatted_toppers_answers)
    return result

# Example usage
user_writing = "The impact of climate change on agriculture is significant. It affects crop yields and water availability."
question = "Explain the impact of climate change on agriculture."
topic = "scientific"  # or "descriptive"

output = judge_writing(user_writing, question, topic)
print(output)