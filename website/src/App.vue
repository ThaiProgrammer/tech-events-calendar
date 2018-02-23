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
    <footer class="text-center mt-5 mb-4 pl-3 pr-3 text-gray">
      ข้อมูลไม่ครบ? ข้อมูลผิดพลาด? มีข้อเสนอแนะ?
      ช่วยเราพัฒนาได้ที่<a href="https://github.com/ThaiProgrammer/tech-events-calendar#contributing">โปรเจกต์​ ThaiProgrammer/tech-events-calendar บน GitHub</a>
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
