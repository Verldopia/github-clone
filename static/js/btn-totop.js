
$btn = document.getElementById('btn-totop');
$main = document.querySelector('.container-main')
window.addEventListener('scroll', scrollDown);
$btn.addEventListener('click', toTop);

function scrollDown() {
  if ($main.scrollTop > 100) {
    $btn.style.opacity = '0';
  } else {
    $btn.style.opacity = '0';
  }
}

function toTop() {
  $main.scrollTop = 0;
}