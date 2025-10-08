# PrepMitra

### Step 1: Setting Up the Backend (Python)

The backend server is responsible for processing requests and running the machine learning model.

1. Open your terminal and navigate to the backend/ folder:

    bash
    cd backend/
    

2. Install the required Python dependencies (make sure you have a virtual environment set up):

    bash
    pip install -r requirements.txt
    

    If requirements.txt is not provided, you'll need to install the dependencies manually. Here’s an example of what you might need:

    bash
    pip install flask flask-cors langchain langchain_huggingface langchain_chroma langchain_groq dotenv
    

3. Run the backend Python server:

    bash
    python back.py
    

    The backend server should now be running and accessible at http://localhost:5000 (or any other port specified in your back.py file).

### Step 2: Setting Up the Frontend (Next.js)

Now let's set up the frontend, which is built using Next.js.

1. Open a new terminal window and navigate to the src/ folder:

    bash
    cd src/
    

2. Install the required dependencies using npm (or yarn):

    bash
    npm install
    

    If you're using yarn:

    bash
    yarn install
    

3. Start the Next.js development server:

    bash
    npm run dev
    

    This will start the Next.js app at http://localhost:3000. You can now open this URL in your browser and interact with the frontend.

### Step 3: Interacting with the ML Model

Once both the backend and frontend are running, the frontend will send requests to the backend Python server to interact with the machine learning model.

- You can visit the Next.js app (running at http://localhost:3000) and submit queries. The backend will process these queries using the ML model and return the results.