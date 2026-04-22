from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from models import DBMS


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    connection_string: str = Field(validation_alias="CONNECTION_STRING")
    database_name: str = Field(validation_alias="DATABASE_NAME")
    dbms: DBMS = Field(validation_alias="DBMS")


settings = Settings()
