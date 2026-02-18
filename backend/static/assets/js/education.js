/* Education Page - Course Filtering and Interactions */

const categories = document.querySelectorAll(".category");
const courses = document.querySelectorAll(".course");
const enrollButtons = document.querySelectorAll(".btn-enroll");

// Category Filtering
categories.forEach(cat => {
  cat.addEventListener("click", () => {
    // Update active category
    categories.forEach(c => c.classList.remove("active"));
    cat.classList.add("active");

    const selected = cat.dataset.category;
    let visibleCount = 0;

    // Filter courses
    courses.forEach(course => {
      if (selected === "all" || course.dataset.category === selected) {
        course.style.display = "flex";
        course.style.animation = "fadeIn 0.3s ease-out";
        visibleCount++;
      } else {
        course.style.display = "none";
      }
    });

    // Optional: Show message if no courses found
    if (visibleCount === 0) {
      console.log("No courses found in this category");
    }
  });
});

// Enroll Button Interactions
enrollButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    
    const courseName = btn.closest(".course").querySelector("h4").textContent;
    const coursePrice = btn.closest(".course").querySelector(".price").textContent;
    
    // Show enrollment confirmation
    showEnrollmentNotification(courseName, coursePrice);
    
    // Add animation feedback
    btn.style.transform = "scale(0.95)";
    setTimeout(() => {
      btn.style.transform = "scale(1)";
    }, 100);
  });
});

// Enrollment Notification
function showEnrollmentNotification(courseName, price) {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = "enrollment-notification";
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <div>
        <h4>Enrollment Started</h4>
        <p>${courseName} - ${price}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Add styles if not already present
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      .enrollment-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
      }

      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .notification-content i {
        font-size: 24px;
      }

      .notification-content h4 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }

      .notification-content p {
        margin: 4px 0 0 0;
        font-size: 12px;
        opacity: 0.9;
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 480px) {
        .enrollment-notification {
          top: 10px;
          right: 10px;
          left: 10px;
          padding: 12px 16px;
        }

        .notification-content h4 {
          font-size: 13px;
        }

        .notification-content p {
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideInRight 0.3s ease-out reverse";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Initialize - Show all courses on page load
window.addEventListener("DOMContentLoaded", () => {
  courses.forEach(course => {
    course.style.animation = "fadeIn 0.3s ease-out";
  });
});
