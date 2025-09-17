from rest_framework import serializers

from .models import *


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'firstname', 'lastname']


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ['id', 'title']

class CustomUserSerializer(serializers.ModelSerializer):
    user_group = UserGroupSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'firstname', 'lastname', 'email', 'phone', 'user_group']

class CustomUserCreateSerializer(serializers.ModelSerializer):
    re_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'firstname', 'lastname', 'phone', 'password', 're_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['re_password']:
            raise serializers.ValidationError({"re_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('re_password')  # not needed for user creation
        return CustomUser.objects.create_user(**validated_data)

