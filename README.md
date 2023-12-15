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
