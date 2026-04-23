from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["user", "created_at", "updated_at"]

    def validate(self, data):
        application_date = data.get("application_date")
        follow_up_date = data.get("follow_up_date")
        deadline = data.get("deadline")

        if follow_up_date and application_date and follow_up_date < application_date:
            raise serializers.ValidationError({
                "follow_up_date": "Follow-up date must be after or equal to application date."
            })

        if deadline and application_date and deadline < application_date:
            raise serializers.ValidationError({
                "deadline": "Deadline must be after or equal to application date."
            })

        return data