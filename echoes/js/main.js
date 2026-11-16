document.addEventListener('DOMContentLoaded', () => {
  const stageButtons = document.querySelectorAll('.timetable__stage-btn');
  const stageContents = document.querySelectorAll('.timetable__rows');

  stageButtons.forEach(button => {
    button.addEventListener('click', () => {
      // すべてのボタンとコンテンツから active クラスを削除
      stageButtons.forEach(btn => btn.classList.remove('active'));
      stageContents.forEach(content => content.classList.remove('active-content'));

      // クリックされたボタンに active クラスを追加
      button.classList.add('active');

      // 対応するコンテンツを表示
      const targetId = button.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active-content');
      }
    });
  });
});