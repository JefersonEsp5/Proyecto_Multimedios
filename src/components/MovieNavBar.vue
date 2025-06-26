<template>
  <nav class="navbar">
    <div class="navbar-left-desktop">
      <div class="logo">
        <img src="../assets/logoPeliculas.png" alt="logo Peliculas" class="logo-icon" />
      </div>
      <NavLinks class="nav-links-desktop" />
    </div>

    <div class="mobile-top-bar">
      <SearchBar @search="handleSearch" class="search-bar-mobile" />
      <UserProfile class="user-profile-mobile" />
    </div>

    <div class="mobile-nav-links">
      <NavLinks />
    </div>

    <div class="navbar-right-desktop">
      <SearchBar class="search-bar-desktop" @search="handleSearch" />
      <UserProfile class="user-profile-desktop" />
    </div>

    </nav>
</template>

<script>
import NavLinks from './NavLinks.vue';
import SearchBar from './SearchBar.vue';
import UserProfile from './UserProfile.vue';

export default {
  name: 'MovieNavBar',
  components: {
    NavLinks,
    SearchBar,
    UserProfile,
  },
  data() {
    return {
      // isMobileMenuOpen is no longer needed as there's no explicit mobile menu toggle
    };
  },
  methods: {
    handleSearch(query) {
      console.log('Search query from NavBar:', query);
      // Implement your search logic here
    },
  },
  // No need for mounted event listener for resizing a mobile menu
};
</script>

<style scoped>
.navbar {
  display: flex;
  flex-wrap: wrap; /* Allows items to wrap to the next line */
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 15px 10px;
  color: white;
  position: relative;
  z-index: 1000;
}

/* ---------------- MOBILE STYLES (Default for less than 769px) ---------------- */

/* Hide desktop-specific elements by default on mobile */
.navbar-left-desktop,
.navbar-right-desktop,
.nav-links-desktop,
.user-profile-desktop,
.search-bar-desktop {
  display: none;
}

/* Ensure mobile elements are visible by default */
.mobile-top-bar {
  display: flex;
  width: 100%; /* Take full width */
  justify-content: space-between; /* Space out search bar and user profile */
  align-items: center;
  gap: 10px; /* Space between search and profile */
  margin-bottom: 15px; /* Space between top bar and nav links */
}

.search-bar-mobile {
  flex-grow: 1; /* Allow search bar to take available space */
}

.user-profile-mobile {
  /* No specific styles needed here unless you want to adjust size/padding */
}

.mobile-nav-links {
  display: flex;
  width: 100%; /* Take full width */
  justify-content: center; /* Center the navigation links */
  gap: 25px; /* Space between "TV series" and "Movies" */
  padding-top: 10px; /* Add some padding above the links */
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Optional: a subtle separator */
}

/* Style for the links within NavLinks component for mobile */
.mobile-nav-links :deep(.nav-link) { /* Use :deep() to target children of NavLinks */
    color: white;
    text-decoration: none;
    padding: 8px 15px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

.mobile-nav-links :deep(.nav-link) {
  /* Add this to your existing .nav-link styles */
  border-radius: 8px; /* Adjust this value to control the roundness. 
                         You can use px, em, rem, or percentage values. */
   transition: background-color 0.3s ease, color 0.3s ease, border-radius 0.3s ease;
}



/* Hide the hamburger menu as it's no longer needed */
.menu-toggle {
  display: none;
}


/* ---------------- DESKTOP STYLES (for 769px and above) ---------------- */
@media (min-width: 769px) { /* Breakpoint for desktop view */
  .navbar {
    flex-wrap: nowrap; /* Prevent wrapping on desktop */
  }

  /* Show desktop-specific elements */
  .navbar-left-desktop,
  .navbar-right-desktop,
  .nav-links-desktop,
  .user-profile-desktop,
  .search-bar-desktop {
    display: flex;
  }

  /* Hide mobile-specific elements on desktop */
  .mobile-top-bar,
  .mobile-nav-links {
    display: none;
  }

  .navbar-left-desktop {
    display: flex;
    align-items: center;
  }

  .logo {
    margin-right: 20px;
  }

  .nav-links-desktop {
    gap: 20px;
  }

  .navbar-right-desktop {
    display: flex;
    align-items: center;
    gap: 15px; /* Space between search and user profile on desktop */
  }

  /* Ensure the desktop search bar and user profile are flex items */
  .search-bar-desktop,
  .user-profile-desktop {
    display: flex; /* Or inline-flex depending on internal structure */
  }
}

/* General styling for logo */
.logo-icon {
  width: 120px;
  height: 85px;
  /* filter: invert(40%) sepia(80%) saturate(1500%) hue-rotate(220deg) brightness(100%) contrast(100%); */
}

/* Hover effect for navigation links (general) */
/* Assuming NavLinks component renders anchor tags directly or with a class like 'nav-link' */
/* Base styles for your navigation links */
.nav-links-desktop a,
.nav-links-desktop .nav-link {
  display: inline-block; /* Crucial! Ensures the element behaves like a block for padding/margins/backgrounds */
  padding: 8px 12px; /* Add some padding so the background has space to appear */
  border-radius: 4px; /* A small default radius can make the transition smoother, or keep it at 0px */
  transition: background-color 0.3s ease, color 0.3s ease, border-radius 0.3s ease;
  text-decoration: none; /* Often desirable for navigation links */
  color: inherit; /* Inherit default text color, or set one */
}

/* Hover styles for the navigation links */
.nav-links-desktop a:hover,
.nav-links-desktop .nav-link:hover {
  color: #6366f1; /* Indigo text color on hover */
  background-color: rgba(99, 102, 241, 0.2); /* Light indigo background with transparency */
  border-radius: 10px; /* Apply the rounded corners to the background */
}
/* Styling for search and user profile icons */
/* Assuming your SearchBar and UserProfile components have icons that can be targeted,
   e.g., if they are `<i>` tags with a common class `icon` or specific classes. */
.search-bar-desktop :deep(.icon),
.user-profile-desktop :deep(.icon),
.search-bar-mobile :deep(.icon),
.user-profile-mobile :deep(.icon) {
  color: white;
  transition: color 0.3s ease;
}

.search-bar-desktop :deep(.icon):hover,
.user-profile-desktop :deep(.icon):hover,
.search-bar-mobile :deep(.icon):hover,
.user-profile-mobile :deep(.icon):hover {
  color: #6366f1; /* Indigo color */
}


</style>