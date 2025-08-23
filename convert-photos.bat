@echo off
cd "src\assets\images"

echo Converting photos for folder 2...
cd "2.生駒山"
magick "20240811_154805.jpg" "photo1.jpg" 2>nul
magick "20240811_155149.jpg" "photo2.jpg" 2>nul
magick "20240811_155303.jpg" "photo3.jpg" 2>nul
cd ..

echo Converting photos for folder 3...
cd "3.自転車博物館"
magick "20240816_152306.heic" "photo1.jpg" 2>nul
magick "20240816_152655.heic" "photo2.jpg" 2>nul
magick "20240816_152925.heic" "photo3.jpg" 2>nul
cd ..

echo Converting photos for folder 4...
cd "4.某个午后"
magick "20240904_180621.heic" "photo1.jpg" 2>nul
magick "20240904_180631.heic" "photo2.jpg" 2>nul
cd ..

echo Converting photos for folder 5...
cd "5.奈良金刚山"
magick "20240916_102751.heic" "photo1.jpg" 2>nul
magick "20240916_103322.heic" "photo2.jpg" 2>nul
magick "20240916_103412.heic" "photo3.jpg" 2>nul
cd ..

echo Converting photos for folder 6...
cd "6.夜景"
magick "20241220_171849.heic" "photo1.jpg" 2>nul
cd ..

echo Converting photos for folder 7...
cd "7.お花見"
magick "20250406_142806.heic" "photo1.jpg" 2>nul
magick "20250406_142821.heic" "photo2.jpg" 2>nul
magick "20250406_142829.heic" "photo3.jpg" 2>nul
cd ..

echo Converting photos for folder 8...
cd "8.ハルカス"
magick "20250506_144331.heic" "photo1.jpg" 2>nul
magick "20250506_150012.heic" "photo2.jpg" 2>nul
magick "20250506_150140.heic" "photo3.jpg" 2>nul
cd ..

echo Conversion complete!