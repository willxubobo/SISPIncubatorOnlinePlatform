using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;

namespace SISPIncubatorOnlinePlatform.Service.Common
{
    public static partial class QueryableCondition
    {
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <param name="propertyName"></param>
        /// <param name="ascending"></param>
        /// <returns></returns>
        public static IQueryable<T> OrderBy<T>(this IQueryable<T> source, string propertyName, bool ascending) where T : class
        {
            Type type = typeof(T);

            PropertyInfo property = type.GetProperty(propertyName);
            if (property == null)
                throw new ArgumentException("PropertyName", "Not Exist");

            ParameterExpression param = Expression.Parameter(type, "p");
            Expression propertyAccessExpression = Expression.MakeMemberAccess(param, property);
            LambdaExpression orderByExpression = Expression.Lambda(propertyAccessExpression, param);

            string methodName = ascending ? "OrderBy" : "OrderByDescending";

            MethodCallExpression resultExp = Expression.Call(typeof(Queryable), methodName, new Type[] { type, property.PropertyType }, source.Expression, Expression.Quote(orderByExpression));

            return source.Provider.CreateQuery<T>(resultExp);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <param name="source"></param>
        /// <param name="nameValues"></param>
        /// <returns></returns>
        public static IQueryable<TSource> WhereDynamic<TSource>(this IQueryable<TSource> source,

                        Dictionary<string, string> nameValues) where TSource : class
        {
            if (nameValues.Count > 0)
            {
                //Construction c in c=>Body
                ParameterExpression param = Expression.Parameter(typeof(TSource), "c");

                //Construction Body in c=>Body
                var body = GetExpressoinBody(param, nameValues);

                if (body != null)
                {
                    //Construction c=>Body
                    var expression = Expression.Lambda<Func<TSource, bool>>(body, param);
                    return source.Where(expression);
                }
            }
            return source;
        }

        private static Expression GetExpressoinBody(ParameterExpression param, Dictionary<string, string> nameValues)
        {
            var list = new List<Expression>();
            if (nameValues.Count > 0)
            {
                var plist = param.Type.GetRuntimeProperties().ToDictionary(z => z.Name);

                foreach (var item in nameValues)
                {
                    if (item.Key.EndsWith(">"))
                    {
                        #region GreaterThan(>)

                        string key = item.Key.TrimEnd('>');

                        //if (!plist.ContainsKey(key) || item.Value.Length <= 0) continue;

                        var returnType = plist[key].GetMethod.ReturnType;

                        if (returnType == typeof(string)) continue;

                        var expression = Expression.Property(param, key);

                        object returnValue;

                        if (TryParser(item.Value, returnType, out returnValue))

                            list.Add(Expression.GreaterThan(expression, Expression.Convert(Expression.Constant(returnValue), returnType)));

                        #endregion

                    }
                    else if (item.Key.EndsWith("<"))
                    {
                        #region LessThan(<)

                        string key = item.Key.TrimEnd('<');

                        //if (!plist.ContainsKey(key) || item.Value.Length <= 0) continue;

                        var returnType = plist[key].GetMethod.ReturnType;

                        if (returnType == typeof(string)) continue;

                        var expression = Expression.Property(param, key);

                        object returnValue;

                        if (TryParser(item.Value, returnType, out returnValue))
                        {
                            if (returnType == typeof(DateTime)) returnValue = ((DateTime)returnValue).AddDays(1);

                            list.Add(Expression.LessThan(expression, Expression.Convert(Expression.Constant(returnValue), returnType)));
                        }

                        #endregion
                    }
                    else if (plist.ContainsKey(item.Key) && item.Value.Length > 0)
                    {
                        var expressionKey = Expression.Property(param, item.Key);
                        var returnType = plist[item.Key].GetMethod.ReturnType;

                        if (item.Value.IndexOf("%") > 0 && returnType == typeof(string))
                        {
                            #region Like(%)

                            var value = item.Value.Trim('%');
                            var expressionValue = Expression.Constant(value);

                            if (item.Value.Length - value.Length >= 2)
                                list.Add(Expression.Call(expressionKey, "Contains", null, new Expression[] { expressionValue }));
                            else if (item.Value.StartsWith("%"))
                                list.Add(Expression.Call(expressionKey, "EndsWith", null, new Expression[] { expressionValue }));
                            else if (item.Value.EndsWith("%"))
                                list.Add(Expression.Call(expressionKey, "StartsWith", null, new Expression[] { expressionValue }));
                            else
                                list.Add(Expression.Equal(expressionKey, expressionValue));

                            #endregion
                        }
                        else if (returnType == typeof(string))
                        {
                            if (item.Value.IndexOf(",") > 0)
                            {
                                #region Contains(in)

                                if (returnType == typeof(short))
                                {
                                    var searchList = TryParser<short>(item.Value);

                                    if (searchList.Any())
                                    {
                                        list.Add(Expression.Call(Expression.Constant(searchList), "Contains", null, new Expression[] { expressionKey }));
                                    }
                                }
                                else if (returnType == typeof(int))
                                {
                                    var searchList = TryParser<int>(item.Value);

                                    if (searchList.Any())

                                        list.Add(Expression.Call(Expression.Constant(searchList), "Contains", null, new Expression[] { expressionKey }));
                                }
                                else if (returnType == typeof(long))
                                {
                                    var searchList = TryParser<long>(item.Value);

                                    if (searchList.Any())

                                        list.Add(Expression.Call(Expression.Constant(searchList), "Contains", null, new Expression[] { expressionKey }));
                                }
                                else if (returnType == typeof(string))
                                {
                                    var searchList = TryParser<string>(item.Value);

                                    if (searchList.Any())

                                        list.Add(Expression.Call(Expression.Constant(searchList), "Contains", null, new Expression[] { expressionKey }));
                                }

                                #endregion
                            }
                            else if (returnType == typeof(string))
                            {
                                #region Equal (=)

                                object returnValue;
                                if (TryParser(item.Value, returnType, out returnValue))
                                    list.Add(Expression.Equal(expressionKey, Expression.Convert(Expression.Constant(returnValue), returnType)));

                                #endregion
                            }
                        }
                        else
                        {
                            #region Equal

                            object returnValue;
                            if (TryParser(item.Value, returnType, out returnValue))
                                list.Add(Expression.Equal(expressionKey, Expression.Convert(Expression.Constant(returnValue), returnType)));
                            #endregion
                        }
                    }
                }
            }

            return list.Count > 0 ? list.Aggregate(Expression.AndAlso) : null;
        }

        private static List<T> TryParser<T>(string value)
        {
            string[] searchArray = value.Split(',');
            List<T> dList = new List<T>();
            foreach (var l in searchArray)
            {
                try
                {
                    T dValue = (T)Convert.ChangeType(l, typeof(T));
                    dList.Add(dValue);
                }
                catch { }
            }
            return dList;
        }

        private static bool TryParser(object value, Type outType, out object dValue)
        {

            try
            {
                //dValue = Convert.ChangeType(value, outType);
                Type type = outType;

                if (type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
                {
                    if (value == null)
                    {
                        dValue = null;
                        return true;
                    }
                    type = Nullable.GetUnderlyingType(type);
                }

                dValue = Convert.ChangeType(value, type);
                return true;
            }
            catch
            {
                dValue = null;
                return false;
            }
        }

        public static T? ConvertTo<T>(this IConvertible convertibleValue) where T : struct
        {
            if (null == convertibleValue)
            {
                return null;
            }
            return (T?)Convert.ChangeType(convertibleValue, typeof(T));
        }
    }
}