c:\Users\User\Desktop\food-delivery-app-zustand-master\components\add-product-form.tsx
<<<<<<< SEARCH
            <div className="flex justify-between items-center mb-8 border-b border-[#D8D2C2] pb-4 sticky top-0 bg-inherit z-10">
              <h2 className="text-2xl font-black text-black">إضافة منتج جديد - بن آسر</h2>
              <h2 className="text-2xl font-black text-black dark:text-white">إضافة منتج جديد - بن آسر</h2>
              <button onClick={() => setIsOpen(false)} className="text-3xl hover:text-red-500 transition">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Details */}
              <div className="space-y-4 p-1">
                <h3 className="text-xl font-bold text-center text-black border-b-2 border-[#D8D2C2] pb-2 mb-6">تفاصيل المنتج الأساسية</h3>
                <h3 className="text-xl font-bold text-center text-black dark:text-white border-b-2 border-[#D8D2C2] pb-2 mb-6">تفاصيل المنتج الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black">اسم نوع البن</label>
                    <input name="name" value={newProduct.name} onChange={handleChange} type="text" className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none focus:ring-2 focus:ring-[#B17457] text-black" placeholder="مثلاً: بن يمني إكسبريسو" required />
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">اسم نوع البن</label>
                    <input name="name" value={newProduct.name} onChange={handleChange} type="text" className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-[#B17457] text-black dark:text-white" placeholder="مثلاً: بن يمني إكسبريسو" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black">درجة التحميص</label>
                    <select name="roastLevel" value={newProduct.roastLevel} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none text-black">
                      <option value="فاتح" className="text-black">فاتح</option>
                      <option value="وسط" className="text-black">وسط</option>
                      <option value="غامق (محروق)" className="text-black">غامق (محروق)</option>
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">درجة التحميص</label>
                    <select name="roastLevel" value={newProduct.roastLevel} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none text-black dark:text-white">
                      <option value="فاتح" className="text-black dark:text-black">فاتح</option>
                      <option value="وسط" className="text-black dark:text-black">وسط</option>
                      <option value="غامق (محروق)" className="text-black dark:text-black">غامق (محروق)</option>
                    </select>
                  </div>
                   <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-black">التصنيف</label>
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">التصنيف</label>
                    <Select onValueChange={handleCategoryChange} value={newProduct.categoryId}>
                      <SelectTrigger className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none text-black">
                      <SelectTrigger className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none text-black dark:text-white">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id} className="text-black">{category.name}</SelectItem>
                          <SelectItem key={category.id} value={category.id} className="text-black dark:text-white">{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-black">وصف النكهة</label>
                    <textarea name="description" value={newProduct.description} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 outline-none h-24 text-black" placeholder="اكتبي تفاصيل الطعم والإيحاءات..."></textarea>
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">وصف النكهة</label>
                    <textarea name="description" value={newProduct.description} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none h-24 text-black dark:text-white" placeholder="اكتبي تفاصيل الطعم والإيحاءات..."></textarea>
                  </div>
                </div>
              </div>

              {/* Sizes Details */}
              <div className="space-y-8 p-1">
                <h3 className="text-xl font-bold text-center text-black border-b-2 border-[#D8D2C2] pb-2 mb-6">الأحجام والأسعار والصور</h3>
                <h3 className="text-xl font-bold text-center text-black dark:text-white border-b-2 border-[#D8D2C2] pb-2 mb-6">الأحجام والأسعار والصور</h3>
                
                {(Object.keys(newProduct.sizes) as Array<keyof typeof newProduct.sizes>).map(sizeName => (
                  <div key={sizeName} className="p-4 border rounded-lg admin-border space-y-4 bg-white/20">
                    <h4 className="font-bold text-lg text-black">حجم: {sizeName}</h4>
                    <h4 className="font-bold text-lg text-black dark:text-white">حجم: {sizeName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1 text-black">السعر (ج.م)</label>
                        <label className="block text-sm font-bold mb-1 text-black dark:text-white">السعر (ج.م)</label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.sizes[sizeName].price}
                          onChange={(e) => handleSizeChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border text-black"
                          className="w-full p-2 rounded-md border admin-border text-black dark:text-white bg-white dark:bg-gray-800"
                          placeholder="السعر"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1 text-black">مسار الصورة</label>
                        <label className="block text-sm font-bold mb-1 text-black dark:text-white">مسار الصورة</label>
                        <input
                          type="text"
                          value={newProduct.sizes[sizeName].image}
                          onChange={(e) => handleImageChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border text-black"
                          className="w-full p-2 rounded-md border admin-border text-black dark:text-white bg-white dark:bg-gray-800"
                          placeholder="e.g., /image.png"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8 pt-4 border-t border-[#D8D2C2]">
                <button type="submit" className="admin-btn-primary flex-1 py-3 rounded-lg font-black text-white">حفظ في المخزن</button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 border-2 border-[#D8D2C2] rounded-lg font-bold hover:bg-gray-100 transition text-black">إلغاء</button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 border-2 border-[#D8D2C2] rounded-lg font-bold hover:bg-gray-100 transition text-black dark:text-white">إلغاء</button>
              </div>
            </form>
=======
            <div className="flex justify-between items-center mb-8 border-b border-[#D8D2C2] pb-4 sticky top-0 bg-inherit z-10">
              <h2 className="text-2xl font-black text-black dark:text-white">إضافة منتج جديد - بن آسر</h2>
              <button onClick={() => setIsOpen(false)} className="text-3xl hover:text-red-500 transition">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Product Details */}
              <div className="space-y-4 p-1">
                <h3 className="text-xl font-bold text-center text-black dark:text-white border-b-2 border-[#D8D2C2] pb-2 mb-6">تفاصيل المنتج الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">اسم نوع البن</label>
                    <input name="name" value={newProduct.name} onChange={handleChange} type="text" className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-[#B17457] text-black dark:text-white" placeholder="مثلاً: بن يمني إكسبريسو" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">درجة التحميص</label>
                    <select name="roastLevel" value={newProduct.roastLevel} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none text-black dark:text-white">
                      <option value="فاتح" className="text-black dark:text-black">فاتح</option>
                      <option value="وسط" className="text-black dark:text-black">وسط</option>
                      <option value="غامق (محروق)" className="text-black dark:text-black">غامق (محروق)</option>
                    </select>
                  </div>
                   <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">التصنيف</label>
                    <Select onValueChange={handleCategoryChange} value={newProduct.categoryId}>
                      <SelectTrigger className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none text-black dark:text-white">
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id} className="text-black dark:text-white">{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-black dark:text-white">وصف النكهة</label>
                    <textarea name="description" value={newProduct.description} onChange={handleChange} className="w-full p-3 rounded-lg border admin-border bg-white/50 dark:bg-gray-800 outline-none h-24 text-black dark:text-white" placeholder="اكتبي تفاصيل الطعم والإيحاءات..."></textarea>
                  </div>
                </div>
              </div>

              {/* Sizes Details */}
              <div className="space-y-8 p-1">
                <h3 className="text-xl font-bold text-center text-black dark:text-white border-b-2 border-[#D8D2C2] pb-2 mb-6">الأحجام والأسعار والصور</h3>
                
                {(Object.keys(newProduct.sizes) as Array<keyof typeof newProduct.sizes>).map(sizeName => (
                  <div key={sizeName} className="p-4 border rounded-lg admin-border space-y-4 bg-white/20">
                    <h4 className="font-bold text-lg text-black dark:text-white">حجم: {sizeName}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1 text-black dark:text-white">السعر (ج.م)</label>
                        <input
                          type="number"
                          name="price"
                          value={newProduct.sizes[sizeName].price}
                          onChange={(e) => handleSizeChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border text-black dark:text-white bg-white dark:bg-gray-800"
                          placeholder="السعر"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm font-bold mb-1 text-black dark:text-white">مسار الصورة</label>
                        <input
                          type="text"
                          value={newProduct.sizes[sizeName].image}
                          onChange={(e) => handleImageChange(e, sizeName)}
                          className="w-full p-2 rounded-md border admin-border text-black dark:text-white bg-white dark:bg-gray-800"
                          placeholder="e.g., /image.png"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8 pt-4 border-t border-[#D8D2C2]">
                <button type="submit" className="admin-btn-primary flex-1 py-3 rounded-lg font-black text-white">حفظ في المخزن</button>
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-3 border-2 border-[#D8D2C2] rounded-lg font-bold hover:bg-gray-100 transition text-black dark:text-white">إلغاء</button>
              </div>
            </form>
>>>>>>> REPLACE
