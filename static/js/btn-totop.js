
$btn = document.getElementById('btn-totop');
$main = document.querySelector('.container-main');
$users = document.querySelector('.box-github--users');
$main.addEventListener('scroll', scrollDown);
$btn.addEventListener('click', toTop);

function scrollDown() {
  if ($main.scrollTop > 100) {
    $btn.style.opacity = '1';
  } else {
    $btn.style.opacity = '0';
  }
}

function toTop() {
  $users.scrollTop = 0;
  $main.scrollTop = 0;
}