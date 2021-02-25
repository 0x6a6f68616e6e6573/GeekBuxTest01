import React, { Component } from 'react';

import { useEffect, useState } from 'react';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

import styles from '../../styles/header.module.css';

function Header({func}){
  const [theme, setTheme] = useState('light');
  const setMode = (mode:string) => {
    cookies.set('theme', mode, { path: '/' });
    setTheme(mode);
    document.body.className= `theme-${mode}`;
  };

  const themeToggler = () => {
    theme === 'light' ? setMode('dark') : setMode('light');
  };

  useEffect(() => {
    const localTheme = cookies.get('theme');
    if (!localTheme) setMode('light');
    document.body.className = `theme-${theme}`;

    var nav = document.querySelector('nav');
    let list = document.querySelector('nav ul');
    var line = document.getElementById('line');

    let as = nav.querySelectorAll('ul li a');
    let path = window.location.pathname.replace('/', '');

    var active = nav.querySelector('.active') as HTMLElement;
    let myDiv = Array.from(as).filter(e => e.textContent == path)[0]?.parentElement;
    if(!myDiv)
      if(path == 'home')
        myDiv = active;
        
    if (myDiv) {
      if (myDiv != active && path != '') {
        myDiv.className = 'active';
        active.className = '';
        active = myDiv;
      }

      if (active) active.style.opacity = '1';
      var pos = 0;
      var wid = 0;

      if (active) {
        pos = active.offsetLeft;
        wid = active.offsetWidth;
        line.style.left = pos - 5 + 'px';
        line.style.width = wid + 10 + 'px';
      }

      let id = null;
      for (let index = 0; index < as.length; index++) {
        as[index].addEventListener('click', (e) => {
          e.preventDefault();
          var _this = e.target as HTMLElement;
          if (!_this.parentElement.classList.contains('active') && !(list.className == 'animate') && !id) {
            _this = _this.parentElement;
            let item = nav.querySelector('.active') as HTMLElement;
            item.className = '';
            item.style.opacity = '0.4';
            var position = {
              top: _this.offsetTop,
              left: _this.offsetLeft,
            };
            var width = _this.offsetWidth;

            list.className = 'animate';

            let posPlus = 2,
              widPlus = 2;
            if (position.left < pos)
              posPlus = -posPlus;
            if (width < wid)
              widPlus = -widPlus;

            id = setInterval(() => {
              if (posPlus > 0) {
                if (pos >= position.left - 5)
                  posPlus = 0;
              } else {
                if (position.left - 5 >= pos)
                  posPlus = 0;
              }
              if (widPlus > 0) {
                if (wid >= width + 5)
                  widPlus = 0;
              } else {
                if (width + 5 >= wid)
                  widPlus = 0;
              }

              if (posPlus == widPlus && posPlus == 0) {
                clearInterval(id);
                id = null;
              }
              pos += posPlus;
              wid += widPlus;
              line.style.left = pos + "px";
              line.style.width = wid + "px";
            }, 1);
            list.className = '';
            _this.className = 'active';
            _this.style.opacity = '1';
            let link = _this.firstElementChild.textContent;
            if (link == 'home') link = '';
            window.history.pushState('', '', `/${link}`);
            func(link);
          }
        })
      }
    }

  }, []);

  return (
  <nav className={styles.nav}>
    <ul>
      <li className="active"><a href="/">home</a></li>
      <li><a href="/earn">earn</a></li>
      <li><a href="#">withdraw</a></li>
      <div className={styles.line} id="line"></div>
    </ul>
    <div className={styles.link_wrapper}>
      <a onClick={()=> themeToggler()} href="#">Theme</a>
    </div>
  </nav>
  )
}

export default Header;