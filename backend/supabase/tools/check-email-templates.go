// Run with: go run backend/supabase/tools/check-email-templates.go
// Uses only synthetic values. Never connects to Supabase or sends email.
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	htmltemplate "html/template"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	texttemplate "text/template"
)

func must(err error) {
	if err != nil {
		panic(err)
	}
}
func require(ok bool, message string) {
	if !ok {
		panic(message)
	}
}

func main() {
	_, filename, _, ok := runtime.Caller(0)
	require(ok, "cannot locate template sources")
	root := filepath.Join(filepath.Dir(filename), "..", "email-templates")
	raw, err := os.ReadFile(filepath.Join(root, "subjects.json"))
	must(err)
	subjects := map[string]string{}
	must(json.Unmarshal(raw, &subjects))
	cases := []struct {
		value    any
		language string
	}{
		{"pt-BR", "pt-BR"}, {"en", "en"}, {"es", "es"}, {nil, "pt-BR"},
		{"fr", "pt-BR"}, {42, "pt-BR"}, {true, "pt-BR"},
		{map[string]any{"unexpected": "en"}, "pt-BR"},
		{`en"><script>alert(1)</script>`, "pt-BR"},
	}
	count := 0
	for _, kind := range []string{"confirmation", "recovery"} {
		raw, err := os.ReadFile(filepath.Join(root, kind+".html"))
		must(err)
		body, err := htmltemplate.New(kind).Option("missingkey=default").Parse(string(raw))
		must(err)
		subject, err := texttemplate.New(kind).Option("missingkey=default").Parse(subjects[kind])
		must(err)
		for _, c := range cases {
			data := map[string]any{"Data": map[string]any{"language": c.value}, "ConfirmationURL": "https://example.invalid/verify?token=synthetic&type=" + kind}
			var rendered, heading bytes.Buffer
			must(body.Execute(&rendered, data))
			must(subject.Execute(&heading, data))
			output := rendered.String()
			require(strings.Contains(output, "lang='"+c.language+"'"), kind+": wrong fallback/language")
			require(!strings.Contains(output, "{{") && !strings.Contains(heading.String(), "{{"), kind+": unresolved directive")
			require(!strings.Contains(output, "<script") && !strings.Contains(output, "#ZgotmplZ"), kind+": unsafe rendering")
			require(strings.Count(output, `href="`) == 1, kind+": expected one action URL")
			require(strings.Contains(output, `href="https://example.invalid/verify?token=synthetic&amp;type=`+kind+`"`), kind+": confirmation URL changed or not escaped")
			require(!strings.ContainsAny(heading.String(), "\r\n"), kind+": multiline subject")
			expected := map[string]map[string]string{
				"confirmation": {"pt-BR": "Confirme seu e-mail", "en": "Confirm your email", "es": "Confirma tu correo"},
				"recovery":     {"pt-BR": "Recupere seu acesso", "en": "Recover your access", "es": "Recupera tu acceso"},
			}[kind][c.language]
			require(heading.String() == expected+" | GitHub Bookshelf", kind+": wrong localized subject")
			require(strings.Contains(output, ">"+expected+"</h1>"), kind+": wrong localized heading")
			count++
		}
		// Existing accounts can have no metadata at all.
		var empty bytes.Buffer
		must(body.Execute(&empty, map[string]any{"Data": nil, "ConfirmationURL": "https://example.invalid/verify"}))
		require(strings.Contains(empty.String(), "lang='pt-BR'"), kind+": absent metadata must default to Portuguese")
		count++
	}
	fmt.Printf("Email templates: %d synthetic renders passed; no messages sent.\n", count)
}
