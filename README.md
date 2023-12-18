# schoolTalks_FE
오류명: 파일 업로드 오류

오류내용: 서버 응답에 따르면 파일 업로드 시 다음과 같은 오류 발생.

```
{
  "image": [
    "제출된 데이터는 파일이 아닙니다. 제출된 서식의 인코딩 형식을 확인하세요."
  ],
  "attachment": [
    "제출된 데이터는 파일이 아닙니다. 제출된 서식의 인코딩 형식을 확인하세요."
  ]
}
```
해결법:

HTML 폼에 enctype="multipart/form-data" 추가.
JavaScript에서 FormData 객체를 사용하여 파일 업로드 데이터를 적절히 처리.
서버 측 Django 및 Django REST framework 설정 및 뷰 함수를 확인하여 파일 업로드 처리.


문제:

sql
Copy code
NameError: name 'Post' is not defined
SystemCheckError: System check identified some issues:
ERRORS:
post.Comment.author: (fields.E304) Reverse accessor 'User.comments' for 'post.Comment.author' clashes with reverse accessor for 'study.StudyComment.author'.
        HINT: Add or change a related_name argument to the definition for 'post.Comment.author' or 'study.StudyComment.author'.
post.Comment.author: (fields.E305) Reverse query name for 'post.Comment.author' clashes with reverse query name for 'study.StudyComment.author'.
        HINT: Add or change a related_name argument to the definition for 'post.Comment.author' or 'study.StudyComment.author'.
study.StudyComment.author: (fields.E304) Reverse accessor 'User.comments' for 'study.StudyComment.author' clashes with reverse accessor for 'post.Comment.author'.
        HINT: Add or change a related_name argument to the definition for 'study.StudyComment.author' or 'post.Comment.author'.
study.StudyComment.author: (fields.E305) Reverse query name for 'study.StudyComment.author' clashes with reverse query name for 'post.Comment.author'.
        HINT: Add or change a related_name argument to the definition for 'study.StudyComment.author' or 'post.Comment.author'.
해결책:

문제 원인:

이 오류는 Django 모델에서 역 관계(accessor)와 역 질의(reverse query) 이름이 충돌하는 경우 발생합니다.
해결 방법:

각 모델의 역 관계 이름을 명시적으로 설정하여 충돌을 해결해야 합니다.
related_name 매개변수를 사용하여 각 모델의 관계 이름을 고유하게 지정할 수 있습니다.
예제:

python
Copy code
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_comments')
    # 다른 필드들...

class StudyComment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='study_comments')
    # 다른 필드들...
변경 후:

위와 같이 related_name을 설정한 후, makemigrations 및 migrate 명령을 실행하여 데이터베이스를 업데이트합니다.
이렇게 하면 역 관계 이름 충돌 문제가 해결됩니다.


이전 코드 (PUT 방식으로 게시물 수정)

javascript
Copy code
// 이전 코드에서는 PUT 방식으로 게시물을 수정하려고 시도
fetch(`http://127.0.0.1:8000/study/${postId}/update/`, {
    method: 'PUT',
    headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: editedTitle,
        caption: editedCaption,
        image: image,
        attachment: attachment,
    }),
})
변경 후 코드 (PATCH 방식으로 게시물 수정 및 이미지 및 첨부 파일 선택 가능)

javascript
Copy code
// 변경 후 코드에서는 PATCH 방식으로 게시물을 수정하며 이미지와 첨부 파일 선택 여부와 상관없이 수정된 정보가 전송됨
document.getElementById('editPostForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const editedTitle = document.getElementById('postTitle').value;
    const editedCaption = document.getElementById('postCaption').value;
    const imageInput = document.getElementById('postImage');
    const attachmentInput = document.getElementById('postAttachment');

    const formData = new FormData();
    formData.append('title', editedTitle);
    formData.append('caption', editedCaption);

    // 이미지 파일이 선택된 경우에만 FormData에 추가
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    }

    // 첨부 파일이 선택된 경우에만 FormData에 추가
    if (attachmentInput.files.length > 0) {
        formData.append('attachment', attachmentInput.files[0]);
    }

    fetch(`http://127.0.0.1:8000/study/${postId}/update/`, {
        method: 'PATCH',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('게시물 수정 중 오류가 발생했습니다.');
        }
        return response.json();
    })
    .then(data => {
        console.log('게시물이 성공적으로 수정되었습니다:', data);
        // 수정 후 해당 게시물로 이동
        window.location.href = `post.html?postId=${postId}`;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('게시물 수정 실패');
    });
});
변경 후 코드에서는 다음과 같은 주요 변경 사항이 있습니다:

HTTP 메소드: 이전 코드에서는 PUT 방식을 사용했으나, 변경 후 코드에서는 PATCH 방식을 사용하여 게시물을 수정합니다.

FormData 사용: 이미지와 첨부 파일을 선택 여부와 상관없이 FormData에 추가합니다. 이미지 파일과 첨부 파일이 선택되지 않은 경우 FormData에는 추가되지 않습니다.
