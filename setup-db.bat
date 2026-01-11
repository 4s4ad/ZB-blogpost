@echo off
echo Setting up SQLite database...
echo.

REM Set environment variable for this session
set DATABASE_URL=file:./prisma/dev.db

echo Running Prisma migration...
npx prisma migrate dev --name init

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Migration successful! Now seeding database...
    echo.
    npx prisma db seed
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Database setup complete!
        echo.
        echo You can now run: npm run dev
    ) else (
        echo.
        echo ❌ Seeding failed. Please check the error above.
    )
) else (
    echo.
    echo ❌ Migration failed. Please check the error above.
)

pause
