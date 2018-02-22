<template>
  <div id="app">
    <header>
      <div class="header-layout">
        <div class="header-menu header-menu-left">
          <router-link to="/">
            <span class="header-title">
              <strong>calendar</strong>.thaiprogrammer.org
            </span>
          </router-link>
          <router-link to="/list">
            <span>Event list</span>
          </router-link>
        </div>
        <div class="header-menu header-menu-right">
          <a href="https://github.com/ThaiProgrammer/tech-events-calendar">
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
    <router-view/>
    <footer class="text-center mt-5 mb-4 text-gray">
      GitHub: <a href="https://github.com/ThaiProgrammer/tech-events-calendar" class="text-gray"><strong>ThaiProgrammer/tech-events-calendar</strong></a>
      <br>
      Missing events or details incorrect? <a href="https://github.com/ThaiProgrammer/tech-events-calendar/tree/master/CONTRIBUTING.md" class="text-gray"><strong>Please contribute!</strong></a>
      <br>
      The data in this website is also available as <a href="https://thaiprogrammer-tech-events-calendar.spacet.me/calendar.json" class="text-gray"><strong>JSON</strong> file</a> and <a href="https://thaiprogrammer-tech-events-calendar.spacet.me/calendar.ics" class="text-gray"><strong>ICS</strong> file</a>.
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  header {
    background: #19232d;
  }
  .header-layout {
    max-width: 1012px;
    margin: 0 auto;
    display: flex;
    min-height: 48px;
  }
  .header-title {
    color: #FDF8A0;
    font-weight: bold;
  }
  .header-title strong {
    color: #F5B029;
  }
  .header-menu {
    display: flex;
  }
  .header-menu-right {
    margin-left: auto;
  }
  .header-menu a {
    display: flex;
    align-items: center;
    position: relative;
    color: #efefef;
    padding: 0 8px;
    text-decoration: none;
  }
  .header-menu a:hover {
    background: #1e2935;
  }
  .header-menu a.router-link-exact-active {
    color: #f49200;
  }
  .header-menu a.router-link-exact-active::after {
    content: '';
    display: block;
    position: absolute;
    bottom: 0; left: 0; right: 0; height: 4px;
    background: #f49200;
  }
</style>
