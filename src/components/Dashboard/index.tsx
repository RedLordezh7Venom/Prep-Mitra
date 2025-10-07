const Dashboard = () => {
  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between p-4 border-b">
        {/* Modern Navigation */}
      </nav>
      
      <main className="grid grid-cols-12 gap-4 p-6">
        <section className="col-span-3">
          {/* Personalized Study Plan */}
          <PersonalizedPlan />
        </section>
        
        <section className="col-span-6">
          {/* Main Content Area */}
          <StudyArea />
        </section>
        
        <section className="col-span-3">
          {/* Progress Tracking */}
          <ProgressTracker />
        </section>
      </main>
    </div>
  );
}; 