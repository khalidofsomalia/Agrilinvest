// Add your JavaScript code here to implement interactivity

// For example, you can add an event listener to the 'Explore Plots' button to scroll to the available plots section
document.addEventListener('DOMContentLoaded', function() {
  const explorePlotsButton = document.querySelector('.cta-btn');

  explorePlotsButton.addEventListener('click', function() {
    const availablePlotsSection = document.getElementById('available-plots');
    availablePlotsSection.scrollIntoView({ behavior: 'smooth' });
  });
});
