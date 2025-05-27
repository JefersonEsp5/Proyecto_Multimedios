<template>
  <footer class="footer">
    <div class="footer-content">
      <p>
        © 2025 
        <a 
          href="https://github.com/JefersonEsp5/Proyecto_Multimedios.git" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Repositorio de GitHub
        </a> – Proyecto de Multimedios
      </p>
      <ul class="student-list">
        <li>Duarte Castro Jose Angel – B52431</li>
        <li>Espinoza Jeferson – C12676</li>
        <li>González Bonilla Wendy – C13258</li>
        <li>Solís Ríos Gilberth Steve – C17699</li>
        <li>Vargas Rosales Jeison – B98283</li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #1f1f1f;
  color: #ccc;
  padding: 20px 10px;
  text-align: center;
  font-size: 14px;
}

.footer a {
  color: #4fa3ff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
}

.student-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
}

.student-list li {
  margin: 4px 0;
}
</style>
