from django.contrib.auth.models import User
from rest_framework import generics, permissions, serializers, parsers
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"]
        )
        return user


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileSerializer(serializers.ModelSerializer):
    bio = serializers.CharField(source="profile.bio", allow_blank=True, allow_null=True, required=False)
    phone = serializers.CharField(source="profile.phone", allow_blank=True, allow_null=True, required=False)
    location = serializers.CharField(source="profile.location", allow_blank=True, allow_null=True, required=False)
    university = serializers.CharField(source="profile.university", allow_blank=True, allow_null=True, required=False)
    linkedin = serializers.URLField(source="profile.linkedin", allow_blank=True, allow_null=True, required=False)
    github = serializers.URLField(source="profile.github", allow_blank=True, allow_null=True, required=False)
    profile_image = serializers.ImageField(source="profile.profile_image", required=False, allow_null=True)
    cv = serializers.FileField(source="profile.cv", required=False, allow_null=True)

    profile_image_url = serializers.SerializerMethodField()
    cv_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "bio",
            "phone",
            "location",
            "university",
            "linkedin",
            "github",
            "profile_image",
            "cv",
            "profile_image_url",
            "cv_url",
        ]
        read_only_fields = ["id", "username", "profile_image_url", "cv_url"]

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if hasattr(obj, "profile") and obj.profile.profile_image:
            if request:
                return request.build_absolute_uri(obj.profile.profile_image.url)
            return obj.profile.profile_image.url
        return None

    def get_cv_url(self, obj):
        request = self.context.get("request")
        if hasattr(obj, "profile") and obj.profile.cv:
            if request:
                return request.build_absolute_uri(obj.profile.cv.url)
            return obj.profile.cv.url
        return None

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get(self, request):
        serializer = ProfileSerializer(request.user, context={"request": request})
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)