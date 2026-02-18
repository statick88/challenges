// Shared challenge modal functionality

function openChallengeModal(card) {
  const modal = document.getElementById('challenge-modal');
  const iframe = document.getElementById('challenge-iframe');
  const title = document.getElementById('modal-title');
  const solutionLink = document.getElementById('solution-link');
  
  const path = card.getAttribute('data-challenge-path');
  const challengeTitle = card.getAttribute('data-challenge-title');
  const isCompleted = card.getAttribute('data-challenge-completed') === 'true';
  
  title.textContent = challengeTitle;
  iframe.src = path + '/';
  
  if (isCompleted) {
    solutionLink.href = path + '/';
    solutionLink.classList.remove('hidden');
  } else {
    solutionLink.classList.add('hidden');
  }
  
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeChallengeModal() {
  const modal = document.getElementById('challenge-modal');
  const iframe = document.getElementById('challenge-iframe');
  
  modal.classList.add('hidden');
  iframe.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeChallengeModal();
  }
});

// Filter functionality
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.challenge-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        const status = card.getAttribute('data-status');
        if (filter === 'all' || status === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
});
